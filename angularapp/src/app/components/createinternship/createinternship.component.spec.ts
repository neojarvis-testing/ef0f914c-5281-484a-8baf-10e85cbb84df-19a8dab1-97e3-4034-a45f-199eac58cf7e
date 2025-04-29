import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateinternshipComponent } from './createinternship.component';

describe('CreateinternshipComponent', () => {
  let component: CreateinternshipComponent;
  let fixture: ComponentFixture<CreateinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
