<p align="center">
<<<<<<< HEAD

&#x20; <img src="https://i.imgur.com/a5TyjjF.png" width="450" alt="WordDash Logo">

</p>



\# ⌨️ Typing Speed Test



> A real-time web application that measures your typing speed (WPM) and accuracy — built with vanilla HTML, CSS, and JavaScript.



<div align="center">



!\[HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)

!\[CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)

!\[JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)

!\[GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge\&logo=GitHub%20Pages\&logoColor=white)



</div>



\---



\## 📋 Table of Contents



\- \[About the Project](#-about-the-project)

\- \[Features](#-features)

\- \[Getting Started](#-getting-started)

\- \[Project Structure](#-project-structure)

\- \[How It Works](#-how-it-works)

\- \[Tech Stack](#-tech-stack)

\- \[Team](#-team)

\- \[Acknowledgements](#-acknowledgements)





\---



\## 📖 About the Project



\*\*Word Dash\*\* is an interactive web application that challenges users to type a randomly selected paragraph as quickly and accurately as possible. The app tracks elapsed time in real-time and evaluates your performance the moment you finish — giving instant feedback on both speed and accuracy.



This project was built as part of a dual vocational education initiative at \*\*PGKPI – Burgas\*\*, \*"Development of the Dual Education System in VET at PGKPI – Burgas"\*.



\---



\## ✨ Features



| Feature | Description |

|---|---|

| 🎲 \*\*Random Paragraphs\*\* | A new random paragraph is loaded at every start or restart |

| ⏱️ \*\*Live Timer\*\* | Starts automatically on first keystroke, displayed in `HH:MM:SS` format |

| 💨 \*\*WPM Calculation\*\* | Computes words-per-minute based on elapsed time and word count |

| 🎯 \*\*Accuracy Calculation\*\* | Compares typed words against the original and returns a percentage score |

| 🔁 \*\*Restart Anytime\*\* | Instantly clears input, resets timer, and loads a new paragraph |

| 🛑 \*\*Stop \& Review\*\* | Stop the test mid-way and see your current results |

| 📱 \*\*Responsive Layout\*\* | Works seamlessly on desktop and mobile viewports |



\---



\## 🏁 Getting Started



No build tools, no dependencies — just open and type.



\### Prerequisites



\- A modern web browser (Chrome, Firefox, Edge, Safari)

\- \[Git](https://git-scm.com/) \*(optional, for cloning)\*



\### Installation



1\. \*\*Clone the repository\*\*

&#x20;  ```bash

&#x20;  git clone https://github.com/codingburgas/2526-dual-education-worddash

&#x20;  ```



2\. \*\*Navigate into the project folder\*\*

&#x20;  ```bash

&#x20;  cd 2526-dual-education-worddash

&#x20;  ```



3\. \*\*Open `index.html` in your browser\*\*

&#x20;  ```bash

&#x20;  # On macOS

&#x20;  open index.html



&#x20;  # On Linux

&#x20;  xdg-open index.html



&#x20;  # On Windows

&#x20;  start index.html

&#x20;  ```



> 💡 For the best experience, serve the project via a local server (e.g. VS Code's \[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension).



\---



\## 📁 Project Structure



```

2526-dual-education-worddash/

│

├── src/                            # All application source code

│   ├── index.html                  # Entry point — semantic structure

│   │                               # (header, main, section, footer)

│   ├── css/

│   │   └── styles.css              # Single stylesheet (required by spec)

│   │                               # Responsive layout, transitions,

│   │                               # pseudo-classes, timer + result styles

│   └── js/

│       ├── script.js               # Main entry point (required name in spec)

│       │                           # Imports and orchestrates all modules;

│       │                           # registers event listeners (input, click)

│       │

│       ├── modules/                # ES6 feature modules (one concern each)

│       │   ├── timer.js            # start / stop / reset / formatTime

│       │   ├── calculator.js       # calculateWPM(), calculateAccuracy()

│       │   ├── paragraph.js        # getRandomParagraph(), displayParagraph()

│       │   └── ui.js               # All DOM reads/writes; keeps modules

│       │                           # decoupled from specific element IDs

│       └── data/

│           └── paragraphs.js       # Exported array of paragraph strings

│                                   # (grows independently of logic)

│

├── assets/                         # Static non-code resources

│   ├── fonts/                      # Web fonts (e.g. a monospace font for

│   │                               # the typing area — improves UX)

│   └── images/                     # Icons, favicon, any decorative graphics

│

├── Documentation/

│   ├── file-tree-plan.md           # This document

│   ├── architecture.md             # How modules connect; data flow diagram

│   └── user-guide.md               # How to open/use the app (for the defense)

│

├── README.md                       # Required by spec

```



\## ⚙️ How It Works



```

User lands on page

&#x20;     │

&#x20;     ▼

Random paragraph is displayed

&#x20;     │

&#x20;     ▼

User starts typing in a text area

&#x20;     │

&#x20;     ├──► Timer starts on first keystroke

&#x20;     │

&#x20;     ├──► Input is compared to original paragraph in real-time

&#x20;     │

&#x20;     ▼

User clicks Stop OR completes the paragraph

&#x20;     │

&#x20;     ├──► Timer stops

&#x20;     ├──► WPM = (word count / elapsed seconds) × 60

&#x20;     └──► Accuracy = (correct words / total words) × 100

```



\### Formulas



```

WPM      = (number of typed words ÷ elapsed time in minutes)

Accuracy = (correctly typed words ÷ total words in paragraph) × 100

```



\---



\## 🛠️ Tech Stack



\- \*\*HTML5\*\* — Semantic structure (`<section>`, `<header>`, `<footer>`)

\- \*\*CSS3\*\* — Flexbox layout, responsive design, pseudo-classes, transitions

\- \*\*JavaScript (ES6)\*\* — DOM manipulation, event listeners, `setInterval`, array methods



\---



\## 👥 Team



This project was developed by students from \*\*PGKPI – Burgas\*\* during a trial internship at an IT company.



| Name | Role |

|---|---|

| Atanas Todorov | Back-End Development |

| Dimitar Dimitrov | Front-End \& Design Development |



\---



\## 🙏 Acknowledgements



\- Supervised as part of \*"Development of the Dual Education System in VET at PGKPI – Burgas"\*

\- Inspired by popular typing tools like \[MonkeyType](https://monkeytype.com/) and \[10FastFingers](https://10fastfingers.com/)



\---



<div align="center">



Made with ❤️ by WordDash \& Students of PGKPI – Burgas \&nbsp;|\&nbsp; 2026



</div>

=======
  <img src="https://i.imgur.com/a5TyjjF.png" width="450" alt="WordDash Logo">
</p>

# ⌨️ Typing Speed Test

> A real-time web application that measures your typing speed (WPM) and accuracy — built with vanilla HTML, CSS, and JavaScript.

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Team](#-team)
- [Acknowledgements](#-acknowledgements)


---

## 📖 About the Project

**Word Dash** is an interactive web application that challenges users to type a randomly selected paragraph as quickly and accurately as possible. The app tracks elapsed time in real-time and evaluates your performance the moment you finish — giving instant feedback on both speed and accuracy.

This project was built as part of a dual vocational education initiative at **PGKPI – Burgas**, *"Development of the Dual Education System in VET at PGKPI – Burgas"*.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎲 **Random Paragraphs** | A new random paragraph is loaded at every start or restart |
| ⏱️ **Live Timer** | Starts automatically on first keystroke, displayed in `HH:MM:SS` format |
| 💨 **WPM Calculation** | Computes words-per-minute based on elapsed time and word count |
| 🎯 **Accuracy Calculation** | Compares typed words against the original and returns a percentage score |
| 🔁 **Restart Anytime** | Instantly clears input, resets timer, and loads a new paragraph |
| 🛑 **Stop & Review** | Stop the test mid-way and see your current results |
| 📱 **Responsive Layout** | Works seamlessly on desktop and mobile viewports |

---

## 🏁 Getting Started

No build tools, no dependencies — just open and type.

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- [Git](https://git-scm.com/) *(optional, for cloning)*

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codingburgas/2526-dual-education-worddash
   ```

2. **Navigate into the project folder**
   ```bash
   cd 2526-dual-education-worddash
   ```

3. **Open `index.html` in your browser**
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   ```

> 💡 For the best experience, serve the project via a local server (e.g. VS Code's [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension).

---

## 📁 Project Structure

```
2526-dual-education-worddash/
│
├── src/                            # All application source code
│   ├── index.html                  # Entry point — semantic structure
│   │                               # (header, main, section, footer)
│   ├── css/
│   │   └── styles.css              # Single stylesheet (required by spec)
│   │                               # Responsive layout, transitions,
│   │                               # pseudo-classes, timer + result styles
│   └── js/
│       ├── script.js               # Main entry point (required name in spec)
│       │                           # Imports and orchestrates all modules;
│       │                           # registers event listeners (input, click)
│       │
│       ├── modules/                # ES6 feature modules (one concern each)
│       │   ├── timer.js            # start / stop / reset / formatTime
│       │   ├── calculator.js       # calculateWPM(), calculateAccuracy()
│       │   ├── paragraph.js        # getRandomParagraph(), displayParagraph()
│       │   └── ui.js               # All DOM reads/writes; keeps modules
│       │                           # decoupled from specific element IDs
│       └── data/
│           └── paragraphs.js       # Exported array of paragraph strings
│                                   # (grows independently of logic)
│
├── assets/                         # Static non-code resources
│   ├── fonts/                      # Web fonts (e.g. a monospace font for
│   │                               # the typing area — improves UX)
│   └── images/                     # Icons, favicon, any decorative graphics
│
├── Documentation/
│   ├── file-tree-plan.md           # This document
│   ├── architecture.md             # How modules connect; data flow diagram
│   └── user-guide.md               # How to open/use the app (for the defense)
│
├── README.md                       # Required by spec
```

## ⚙️ How It Works

```
User lands on page
      │
      ▼
Random paragraph is displayed
      │
      ▼
User starts typing in a text area
      │
      ├──► Timer starts on first keystroke
      │
      ├──► Input is compared to original paragraph in real-time
      │
      ▼
User clicks Stop OR completes the paragraph
      │
      ├──► Timer stops
      ├──► WPM = (word count / elapsed seconds) × 60
      └──► Accuracy = (correct words / total words) × 100
```

### Formulas

```
WPM      = (number of typed words ÷ elapsed time in minutes)
Accuracy = (correctly typed words ÷ total words in paragraph) × 100
```

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure (`<section>`, `<header>`, `<footer>`)
- **CSS3** — Flexbox layout, responsive design, pseudo-classes, transitions
- **JavaScript (ES6)** — DOM manipulation, event listeners, `setInterval`, array methods

---

## 👥 Team

This project was developed by students from **PGKPI – Burgas** during a trial internship at an IT company.

| Name | Role |
|---|---|
| Atanas Todorov | Back-End Development |
| Dimitar Dimitrov | Front-End & Design Development |

---

## 🙏 Acknowledgements

- Supervised as part of *"Development of the Dual Education System in VET at PGKPI – Burgas"*
- Inspired by popular typing tools like [MonkeyType](https://monkeytype.com/) and [10FastFingers](https://10fastfingers.com/)

---

<div align="center">

Made with ❤️ by WordDash & Students of PGKPI – Burgas &nbsp;|&nbsp; 2026

</div>
>>>>>>> e7138b5dca88c6fb182366ff72b42b81e40d0859
