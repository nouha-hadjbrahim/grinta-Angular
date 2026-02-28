# GRINTA - Frontend Sport Project Notes

## Project Structure
```
src/app/
├── app.component.html          # Root shell — contains only <router-outlet>
├── app.component.ts
├── app-routing.module.ts       # All routes defined here
│
├── sign-in/
│   ├── sign-in.component.html  # Standalone login page (no header/footer)
│   ├── sign-in.component.css   # Dark theme styling
│   └── sign-in.component.ts
│
└── core/
    ├── main/
    │   ├── main.component.html # Layout wrapper: header + <router-outlet> + footer
    │   ├── main.component.css
    │   └── main.component.ts
    ├── header/
    │   ├── header.component.html # Navbar with GRINTA brand + nav links
    │   ├── header.component.css
    │   └── header.component.ts
    └── footer/
        ├── footer.component.html # Footer with copyright
        ├── footer.component.css
        └── footer.component.ts
```

## Routing
| Path       | Component       | Description                              |
|------------|-----------------|------------------------------------------|
| `/`        | —               | Redirects to `/sign-in`                  |
| `/sign-in` | SignInComponent | Full page login (no header/footer)       |
| `/main`    | MainComponent   | Layout shell with header & footer        |
| `/main/**` | (children)      | Child pages rendered inside main layout  |

## What's Done So Far
- [x] Bootstrap 5 + Bootstrap Icons installed via npm and configured in `angular.json`
- [x] Sign-in page designed (dark theme, email/password inputs, Google/Facebook buttons)
- [x] Routing set up with default redirect to `/sign-in`
- [x] `MainComponent` created as the authenticated layout shell
- [x] `HeaderComponent` — navbar with GRINTA branding and nav links
- [x] `FooterComponent` — simple dark footer with copyright
- [x] `main.component.html` uses `<app-header>`, `<router-outlet>`, `<app-footer>`