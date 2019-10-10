import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {
  @Input() loading = false;
  @Input() styleclass = '';
  constructor() { }

  ngOnInit() {
  }

}
