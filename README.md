This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Starta frontend:en 
1. Se till att npm är installerat på din dator.
2. Gå in i mappen till repot med din kommandotolk.
3. Kör `npm install` (detta görs en gång)
4. Kör `npm start`(detta görs varje gång). 
5. Sådär! Hemsidan ligger nu på http://localhost:3000/


## React Bindings för Onsen UI

Använd ES6 imports för att specificera vilka moduler du vill använda i paketet react-onsenui: 

```
import { Page, Toolbar, Button } from 'react-onsenui'; // Importerar specifika komponenter
import * as Ons from 'react-onsenui'; // Importerar allt. Skriv då 'Ons.Page' istället för 'Page' osv
```

CSS:en kan importeras som vanligt med <link>-taggar i index.html eller med Webpack på följande sätt:

```
// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
```

**OBS** CSS:en behöver endast importeras en gång, och detta är gjort i app.js.
Läs mer om hur man använder React Bindings för Onsen UI [här](https://onsen.io/v2/guide/react/)


## Commit Messages

För tydlighetens skull försöker vi skriva på följande format när vi commit:ar: 

```
<type>[optional scope]: <description>
```

#### `type`
* `feat`: (new feature for the user, not a new feature for build script)
* `fix`: (bug fix for the user, not a fix to a build script)
* `docs`: (changes to the documentation)
* `style`: (formatting, missing semi colons, etc; no production code change)
* `refactor`: (refactoring production code, eg. renaming a variable)
* `test`: (adding missing tests, refactoring tests; no production code change)
* `chore`: (updating grunt tasks etc; no production code change)

#### `scope`
Where the change is made (can be left empty if the change is made globally or is difficult be assigned to a specific component)

#### Exempel

`feat(): created a button component`

eller

`style(button): styled primary buttons`


## Google Maps React API
hur man sätter upp google maps react api: https://www.npmjs.com/package/@react-google-maps/api
TL;DR:

Installera @react-google-maps/api med NPM: (görs en gång)


`npm i -S @react-google-maps/api` 

#### Dokumentation Google Maps React API
https://react-google-maps-api-docs.netlify.app/
