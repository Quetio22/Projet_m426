import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagePrincipal } from './landing-page-principal';

describe('LandingPagePrincipal', () => {
  let component: LandingPagePrincipal;
  let fixture: ComponentFixture<LandingPagePrincipal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPagePrincipal],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPagePrincipal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
