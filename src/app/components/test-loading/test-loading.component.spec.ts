import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLoadingComponent } from './test-loading.component';

describe('TestLoadingComponent', () => {
  let component: TestLoadingComponent;
  let fixture: ComponentFixture<TestLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
