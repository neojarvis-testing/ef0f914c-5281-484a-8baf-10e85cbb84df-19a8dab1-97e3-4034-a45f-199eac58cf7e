import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedinternshipComponent } from './requestedinternship.component';

describe('RequestedinternshipComponent', () => {
  let component: RequestedinternshipComponent;
  let fixture: ComponentFixture<RequestedinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
