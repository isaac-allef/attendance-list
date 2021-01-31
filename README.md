<h1 align="center">
    Attendance List
</h1>

<h4 align="center">
  Create Attendance Lists that can accept responses only from Keys chosen by you.
</h4>


<p align="center">
  <a href="#rocket-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-to-use">How To Use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

### Create attendance list
![Create attendance list gif](https://github.com/isaac-allef/attendance-list/blob/main/public/attendance-list-creation.gif)
### Response attendance list
![Response attendance list gif](https://github.com/isaac-allef/attendance-list/blob/main/public/attendance-list-responses.gif)
### Viewing responses attendance list
![Create attendance list gif](https://github.com/isaac-allef/attendance-list/blob/main/public/attendance-list-view-responses.gif)
### Closing attendance list
![Response attendance list gif](https://github.com/isaac-allef/attendance-list/blob/main/public/attendance-list-closation.gif)

## :rocket: Technologies

This project was developed with the following technologies:

-  [ReactJS](https://reactjs.org/)
-  [NextJS](https://nextjs.org/)
-  [Chakra UI](https://chakra-ui.com/)
-  [Formik](https://formik.org/)
-  [NodeJS](https://nodejs.org/en/)
-  [Typescript](https://www.typescriptlang.org/)
-  [Typeorm](https://typeorm.io/#/)
-  [SQLite](https://www.sqlite.org/index.html)
-  [VS Code][vc]

## 📋 Features

### Documentation

- [x] Create Attendance Lists that can accept responses only from Keys previously chosen
- [x] Edit the Attendance Lists and your Keys
- [x] See responses in real time (actually in click time)
- [x] Close and open a Attendance List to recive responses
- [x] API to communication with other systems (backend folder)
- [ ] Option of several Keys representing a single student
- [ ] Upload Keys lists (.csv)
- [ ] Schedule opening and closing Attendance List
- [ ] Send responses to email

## :information_source: How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js v12.20.0][nodejs] or higher + [Yarn 1.22.5][yarn] or higher installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/isaac-allef/attendance-list.git

# Go into the repository
$ cd attendance-list

# Install backend dependencies and run it
$ cd backend
$ yarn install
$ yarn dev

# Install frontend dependencies and run it
$ cd frontend
$ yarn install
$ yarn dev or yarn build && yarn start
```

## :memo: License
This project is under the MIT license. See the [LICENSE](LICENSE) for more information.

---

Made with ♥ by Isaac Allef :wave:

[nodejs]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[vc]: https://code.visualstudio.com/
