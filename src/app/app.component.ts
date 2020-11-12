import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VALIDATOR_PATTERN } from './app.contants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
  x: number;
  y: number;
  onMouseClick$: Observable<any> = fromEvent(document, 'mouseup');
  private unsubscribe$: Subject<undefined> = new Subject();
  speedForm: FormGroup;
  @ViewChild('speedId', {static: true}) speedEle: ElementRef;

  constructor(
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    
    this.speedForm = this.formBuilder.group({
      speed: [1, Validators.compose([
        Validators.pattern(VALIDATOR_PATTERN.speed), 
        Validators.max(10), 
        Validators.min(0)])
      ]
    });

    this.onMouseClick$
    .pipe(takeUntil(this.unsubscribe$)).subscribe(
      e => {
        if (this.speedEle.nativeElement.contains(e.target)) {
        }
        else {
          if(this.speedForm.get('speed').value > 0 && this.speedForm.valid) {
            this.x = e.pageX;
            this.y = e.pageY;
          }
        }
      }
    );
  }

  styleObject() {
    return {
      top: `${this.y}px`, 
      left: `${this.x}px`,
      transition: `${1 / this.speedForm.get('speed').value}s linear` 
    }
  }

  onSubmit() {

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}