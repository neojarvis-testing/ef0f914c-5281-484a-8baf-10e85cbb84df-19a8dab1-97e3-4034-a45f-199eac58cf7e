import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewinternshipComponent } from './viewinternship.component';

describe('ViewinternshipComponent', () => {
  let component: ViewinternshipComponent;
  let fixture: ComponentFixture<ViewinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
