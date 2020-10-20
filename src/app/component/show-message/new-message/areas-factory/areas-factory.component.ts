import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageArea } from 'src/app/model/cap/jsonMapper';

@Component({
  selector: 'app-areas-factory',
  templateUrl: './areas-factory.component.html',
  styleUrls: ['./areas-factory.component.scss']
})
export class AreasFactoryComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() category: any;
  @Output() onBack = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    
  }

  onAreeChanged(aree){
    this.formGroup.patchValue({
      area: aree.map( (area) => {
        return {
          idArea: area.id
        };
      }),
    })
  }

}
