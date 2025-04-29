import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserviewinternshipComponent } from './userviewinternship.component';

describe('UserviewinternshipComponent', () => {
  let component: UserviewinternshipComponent;
  let fixture: ComponentFixture<UserviewinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserviewinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
