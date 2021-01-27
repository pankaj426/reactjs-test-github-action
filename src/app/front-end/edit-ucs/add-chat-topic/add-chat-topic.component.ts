import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../../authentication/services/authentication.service';
import { FrontEndService } from './../../services/front-end.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { discussionType } from "../../../shared/constants/enum";

@Component({
  selector: 'app-add-chat-topic',
  templateUrl: './add-chat-topic.component.html',
  styleUrls: ['./add-chat-topic.component.sass']
})

export class AddChatTopicComponent implements OnInit {
  public addTopicFrm: FormGroup;
  public discussType = discussionType;
  public loader: boolean = false;

  public types = [{
    key: this.discussType.question, value: "Question"
  },
  {
    key: this.discussType.idea, value: "Idea"
  },
  {
    key: this.discussType.challenge, value: "Challenge"
  },
  {
    key: this.discussType.comment, value: "Comment"
  }]
  ucsId: any = "";
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddChatTopicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private frontEndService: FrontEndService,
    private authenticationService: AuthenticationService,
    public toaster: ToastrService) {
    this.ucsId = data.ucsId;
  }

  public ngOnInit(): void {
    this.discussType = discussionType;
    this.addTopicFrm = this.fb.group({
      topic: ['',
        [Validators.required/* , Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*') */]
      ],
      type: ['',
        [Validators.required]
      ]
    });
  }
  closeDialog(passingValue = 0): void {
    this.dialogRef.close(passingValue);
  }

  onSubmitClick() {
    this.loader = true;
    this.authenticationService.makeFormTouched(this.addTopicFrm);
    if (this.addTopicFrm.invalid) {
      this.loader = false;
      return;
    } else {
      let topic = this.addTopicFrm.value.topic.trim();
      let errorMessage = '';
      let data = {
        "ucs_id_1": this.ucsId,
        "ucs_id_2": "",
        "type": this.addTopicFrm.value.type,
        "title": this.addTopicFrm.value.topic.trim()
      }
      if (topic != "") {
        this.frontEndService.addTopic(data).pipe().subscribe((result: any) => {
          this.loader = false;
          if (result.statusCode == 200) {
            this.toaster.success(result.message, "", {
              timeOut: 2000,
            });
            this.closeDialog(1);
          } else {
            errorMessage = 'Something went wrong. Please try after sometime.';
            this.toaster.error(errorMessage, "", {
              timeOut: 2000,
            });
          }
        }, (error: any) => {
          this.loader = false;
          if (error.error.message != null && error.error.message != '') {
            errorMessage = error.error.message;
          }
          else {
            errorMessage = 'Something went wrong. Please try after sometime.';

          }
          this.toaster.error(errorMessage, "", {
            timeOut: 2000,
          });
        }
        );
      } else {
        this.loader = false;
        errorMessage = 'Topic can not be blank!';
        this.toaster.error(errorMessage, "", {
          timeOut: 2000,
        });
      }

    }
  }
}
