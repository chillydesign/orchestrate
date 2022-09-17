import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LinkService {


  constructor(@Inject(DOCUMENT) private doc) { }

  createLink(href: string, rel: string) {
    const link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    this.doc.head.appendChild(link);
  }

  createScript(src: string) {
    const script: HTMLScriptElement = this.doc.createElement('script');
    script.setAttribute('src', src);
    this.doc.head.appendChild(script);
  }
}
