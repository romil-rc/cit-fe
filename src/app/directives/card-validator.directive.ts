import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCardValidator]'
})
export class CardValidatorDirective {

  private cardPatterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^(?:5[1-5][0-9]{14}|2(?:2[2-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[01][0-9]{13}|720[0-9]{12}))$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$/
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cardType = this.validateCardNumber(input.value);
    this.renderer.setProperty(this.el.nativeElement, 'value', input.value);
    this.renderer.setProperty(this.el.nativeElement, 'dataset.cardType', cardType);
  }

  private validateCardNumber(cardNumber: string): string | null {
    for (const [cardType, pattern] of Object.entries(this.cardPatterns)) {
      if (pattern.test(cardNumber)) {
        return cardType;
      }
    }
    return null;
  }

}
