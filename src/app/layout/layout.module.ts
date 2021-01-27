import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatInputModule]
})
export class LayoutModule { }
