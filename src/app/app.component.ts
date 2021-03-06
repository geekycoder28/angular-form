import { Component } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Input } from './input';  
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
 
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
 
export class AppComponent  {

    // screen DPI / PDF DPI
    readonly dpiRatio = 96 / 72;
    
    public myForm: FormGroup;

    public inputList: Input[] = [];

    public zoom = 1;

    public formAuthKey = "";
    public formID = "";
    public formEntityID= "";
    public formURL= "";
 
    constructor(private _fb: FormBuilder,private _apiService: ApiService) {
 
        this.myForm = this._fb.group({});
 
     }

     ngOnInit() {
  
        const url = window.location.href;
        
        if (url.includes('?')) {
          const httpParams = new HttpParams({ fromString: url.split('?')[1] });
         
          this.formAuthKey = httpParams.get('AuthKey');
          this.formID = httpParams.get('fid');
          this.formEntityID = httpParams.get('entid');

          this._apiService.getFormURL(this.formAuthKey,this.formID).subscribe((res: any)=>{
  
            if(res.Message  !=""){
                this.formURL = res[0].Message; 
            }  

        }); 
 
        }

        alert($("input[name=testBox]").val());

        $('input[type="text"]').each(function () {

            alert(777);


            //if ($(this).height() >= 50) {
            //    ar style = $(this).attr('style'),
            //    textbox = $(document.createElement('textarea')).attr('style', style);
            //    $(this).replaceWith(textbox);
            //}
            
        });
 
  
    }
 
    public getDocURL(): string {
          
        var _formURL = "https://form.visitingaid.com/Forms/Forms/Empty.pdf";
 
        if(this.formURL != ""){
            _formURL =this.formURL ;

            document.getElementById("cmdNext").style.visibility = "visible"; 
        }
        else{
            document.getElementById("cmdNext").style.visibility = "hidden"; 
        }

        return _formURL ;
    }
 
    private createInput(annotation: PDFAnnotationData, rect: number[] = null) {
        let formControl = new FormControl(annotation.buttonValue || '');

        const input = new Input();
        input.name = annotation.fieldName;

        if (annotation.fieldType === 'Tx') {
            input.type = 'text';
            input.value = annotation.buttonValue || '';
        }

        if (annotation.fieldType === 'Btn' && !annotation.checkBox) {
            input.type = 'radio';
            input.value = annotation.buttonValue;
        }

        if (annotation.checkBox) {
            input.type = 'checkbox';
            input.value = true;
            formControl = new FormControl(annotation.buttonValue || false);
        }

        // Calculate all the positions and sizes
        if (rect) {
            input.top = rect[1] - (rect[1] - rect[3]);
            input.left = rect[0];
            input.height = (rect[1] - rect[3]) * .9;
            input.width = (rect[2] - rect[0]);

            if(input.height > 30){
                input.type = 'textarea';
            }
 
        }

        this.inputList.push(input);
        return formControl;
    }

    private addInput(annotation: PDFAnnotationData, rect: number[] = null): void {
        // add input to page
        this.myForm.addControl(annotation.fieldName, this.createInput(annotation, rect));
    }

    public getInputPosition(input: Input): any {
        return {
            top: `${input.top}px`,
            left: `${input.left}px`,
            height: `${input.height}px`,
            width: `${input.width}px`,
        };
    }

    public zoomIn(): void {
        this.inputList = this.inputList.map(i => {
            i.left *= (.25 / this.zoom) + 1;
            i.top *= (.25 / this.zoom) + 1;
            i.width *= (.25 / this.zoom) + 1;
            i.height *= (.25 / this.zoom) + 1;
            return i;
        });
        this.zoom += .25;
    }

    public zoomOut(): void {
        this.inputList = this.inputList.map(i => {
            i.left *= 1 - (.25 / this.zoom);
            i.top *= 1 - (.25 / this.zoom);
            i.width *= 1 - (.25 / this.zoom);
            i.height *= 1 - (.25 / this.zoom);
            return i;
        });
        this.zoom -= .25;
    }

    public SaveFormTest(): void {
            
        this._apiService.saveDataWC(this.formAuthKey,this.formID,this.formEntityID, document.getElementById('formData').innerText).subscribe((res: any)=>{

            if(res[0].ID  !=""){
                window.location.href = 'https://forms.visitingaid.com/Default.aspx?AuthKey='+this.formAuthKey+'&fdid='+res[0].ID;
            } 
            else{
                this.formURL ="https://form.visitingaid.com/Forms/Forms/Error.pdf"
                document.getElementById("cmdNext").style.visibility = "hidden"; 
            } 
             
        }); 

    }

 
    public loadComplete(pdf: PDFDocumentProxy): void {
        for (let i = 1; i <= pdf.numPages; i++) {

            // track the current page
            let currentPage = null;
            pdf.getPage(i).then(p => {
                currentPage = p;

                // get the annotations of the current page
                return p.getAnnotations();
            }).then(ann => {

                // ugly cast due to missing typescript definitions
                // please contribute to complete @types/pdfjs-dist
                const annotations = (<any>ann) as PDFAnnotationData[];

                annotations
                    .filter(a => a.subtype === 'Widget') // get the form field annotation only
                    .forEach(a => {

                        // get the rectangle that represent the single field
                        // and resize it according to the current DPI
                        const fieldRect = currentPage.getViewport(this.dpiRatio)
                            .convertToViewportRectangle(a.rect);

                        // add the corresponding input
                        this.addInput(a, fieldRect);
                    });
            });
 
        }
    }
}
