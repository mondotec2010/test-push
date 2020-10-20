import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../injectable/auth/auth.service';
import { UserService } from '../injectable/user.service';
import { Sender } from '../model/sender';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  lang: string;
  user: string;
  userState: boolean;

  langs = [
    {
      value: 'it',
      image: 'assets/icons/it.png',
      language: 'Italiano'
    },
    {
      value: 'en',
      image: 'assets/icons/en.png',
      language: 'English'
    },
    {
      value: 'fr',
      image: 'assets/icons/fr.png',
      language: 'Français'
    },
    {
      value: 'de',
      image: 'assets/icons/de.png',
      language: 'Deutsch'
    },
    {
      value: 'pt',
      image: 'assets/icons/pt.png',
      language: 'Português'
    },
    {
      value: 'es',
      image: 'assets/icons/es.png',
      language: 'Español'
    }
  ];

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = sessionStorage.getItem('User');
    this.lang = sessionStorage.getItem('lang');
    if (!this.lang) {
      this.lang = navigator.language.toString().substring(0, 2);
    }
    this.translate.setDefaultLang(this.lang);
  }


  selectedLangChange(userlanguage: string) {
    this.translate.setDefaultLang(userlanguage);
    sessionStorage.setItem('lang', userlanguage);
    this.lang = sessionStorage.getItem('lang');
    this.userService.changeLanguage(this.lang.toUpperCase()).subscribe((resp) => {
    });
  }

  logout() {
    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  changePassword() {
    this.userService.loginRoute = true;
    this.router.navigate(['change-password']);
  }
}
