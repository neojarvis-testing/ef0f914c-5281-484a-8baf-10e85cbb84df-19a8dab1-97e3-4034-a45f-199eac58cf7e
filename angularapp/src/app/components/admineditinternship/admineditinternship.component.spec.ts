import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmineditinternshipComponent } from './admineditinternship.component';

describe('AdmineditinternshipComponent', () => {
  let component: AdmineditinternshipComponent;
  let fixture: ComponentFixture<AdmineditinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmineditinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmineditinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
