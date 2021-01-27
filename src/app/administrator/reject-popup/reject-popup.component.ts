import { environment } from '../../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { RejectEmitterService } from  "../reject-emitter-service";

@Component({
  selector: 'reject-popup',
  templateUrl: './reject-popup.component.html',
  styleUrls: ['./reject-popup.component.sass']
})
export class RejectPopupComponent implements OnInit {
  _id:any;
  status:any;
  index:any;
  type:any;
  comment:any;
  errorMessage: any = "";
  commentError: boolean = false;
  remarkError: boolean = false; 
  embedPath = environment.services.siteUrl;
  constructor(
    public toaster: ToastrService,
    public rejectEmitterService : RejectEmitterService,
    public dialogRef: MatDialogRef<RejectPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this._id = data._id;
      this.status = data.status;
      this.index = data.index;
      this.type = data.type;
  } 

  closeDialog(passingValue = 0): void {
    this.dialogRef.close(passingValue);
  }
 
  ngOnInit() {
  }

  reject(){
    this.commentError = false;
    this.remarkError =false;
    let value = {
      _id:this._id,
      status : this.status,
      index : this.index,
      comment: this.comment
    }
    if(this.comment == undefined || this.comment == null)
    {
      
      this.commentError = true;
      return;
    }
    if(this.comment.trim() == "")
    {
      this.remarkError = true;
      return;
    }
    if(this.type == "startup"){
     this.rejectEmitterService.onStartupReject(value);
    }else if(this.type == "corporate"){
     this.rejectEmitterService.onCorporateReject(value);
    }
    this.dialogRef.close();
    window.location.reload();
  }
}