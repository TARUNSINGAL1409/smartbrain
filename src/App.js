import React  , {Component}from 'react';
import Navigation from './components/Navigation/Navigation' ; 
import Logo from './components/Logo/Logo' ;
import Clarifai from 'clarifai' ; 
import Imagelinkform from './components/Imagelinkform/Imagelinkform' ; 
import FaceRecognition from './components/FaceRecognition/FaceRecognition' ; 
import Signin from './components/Signin/Signin' ; 
import Rank from './components/Rank/Rank' ;
import Register from './components/Register/Register' ;
import Particles from 'react-particles-js';
import './App.css';

const paritclesOptions = {
  paricles : {
      number :{
        value : 1000 ,
        density : {
          enable : true , 
          value_area : 10  
        }
      }
  }
}

const app = new Clarifai.App({
 apiKey: '2165d632cf544a799d15d78fb86e37e5'
});

class App extends Component {

  constructor() {
    super() ; 
    this.state = {
      input : '' ,
      imageUrl : '' , 
      box : {} , 
      route : 'signin' ,
      isSignedIn : false ,  
    }
  }

  onInputChange = (event) => {
     this.setState({input : event.target.value}) ; 
  }

  calcualteFaceLocation = (data) => {
    const calrifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box ; 
    const image = document.getElementById('inputimage') ; 
    const width = Number(image.width) ; 
    const height = Number(image.height) ; 
    console.log(width , height ) ; 
    return {
      leftCol : calrifaiFace.left_col * width , 
      topRow : calrifaiFace.top_row * height , 
      rightCol : width - (calrifaiFace.right_col * width), 
      bottomRow : height - ( calrifaiFace.bottom_row * height )
    }
  }

  displayFaceBox = (box) => {
    console.log(box) ; 
    this.setState({box : box}) ; 
  }

  onButtonSubmit = () => {
    this.setState({imageUrl : this.state.input}) ; 
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calcualteFaceLocation(response))) 
    .catch(err => console.log(err)) ;      
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({ isSignedIn : false })
    }else if (route === 'home') {
      this.setState({isSignedIn : true})
    }
    this.setState({route : route}) ; 
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={paritclesOptions}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/> 
        { this.state.route === 'home'
            ? <div> 
                <Logo />
                <Rank />
                <Imagelinkform onInputChange = {this.onInputChange}  onButtonSubmit = {this.onButtonSubmit} />
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div> 
            :  ( this.state.route === 'register' 
              ? <Register onRouteChange={this.onRouteChange} />
              : <Signin onRouteChange={this.onRouteChange}/>
              )
        }
      </div>
    );
  }
}

export default App;
