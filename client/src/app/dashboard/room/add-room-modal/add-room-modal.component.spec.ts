import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomModalComponent } from './add-room-modal.component';

describe('AddRoomModalComponent', () => {
  let component: AddRoomModalComponent;
  let fixture: ComponentFixture<AddRoomModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRoomModalComponent]
    });
    fixture = TestBed.createComponent(AddRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
