import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserappliedinternshipComponent } from './userappliedinternship.component';

describe('UserappliedinternshipComponent', () => {
  let component: UserappliedinternshipComponent;
  let fixture: ComponentFixture<UserappliedinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserappliedinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserappliedinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
