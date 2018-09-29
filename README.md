# IOS React Native Dev Setup
1. Install Node and Node Package Manager if you have not.  
`brew install node`    

2. Check to see that both installed. Ensure that your Node version is 6+.  
`npm -v` and `node -v`  

3. Install create-react-native-app.  
`npm install -g create-react-native-app`  

This should prompt you with the following, make sure you reply with 'Y':
```
This command requires Expo CLI.
Do you want to install it globally [Y/n]? Y
```

4. Install watchman. Idk what this does, something with syncing your changes locally everytime?  
`brew install watchman`

5. Clone the repo using  
`git clone git@github.com:dsande30/COSC402.git` or   
`git clone https://github.com/dsande30/COSC402.git`  

6. Start the project  
`cd UTKMentorApp`  
`expo start`  

7. Create an Expo account (also used to sign in to one) using the command `s`

8. Download **Expo Client** from the iOS app store and sign in to your account.

9. Go to the **Projects** tab in the bottom left of the app, and you should see your app in "Recently In Development".

**NOTE**: Matt you might want to look into getting a VM setup with MAC OS running so you can simulate an iPhone. Setting up the VM info is [here](https://blog.udemy.com/xcode-on-windows/) and working with an iOS Simulator can be found [here](https://docs.expo.io/versions/latest/guides/up-and-running.html#open-the-app-on-your-phone-or).
