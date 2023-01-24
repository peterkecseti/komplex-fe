import React, { Component } from 'react';
import logo from './logo.svg';
import cloud from './cloud.png'
import './App.css';

interface State{
  tarhelyek: Tarhely[] 
  nevInput: string;
  meretInput: number;
  arInput: number;
}

interface Tarhely{
  id: number;
  nev: string;
  meret: number;
  ar: number;
}

interface TarhelyListResponse{
  tarhelycsomagok: Tarhely[];
}

class App extends Component<{}, State>{

  constructor(props: {}){
    super(props);

    this.state = {
      nevInput: '',
      meretInput: 0,
      arInput: 0,
      tarhelyek: [],
    }
  }

  async loadTarhelyek() {
    let response = await fetch('http://localhost:3000/api/tarhely');
    let data = await response.json() as TarhelyListResponse;
    this.setState({
      tarhelyek: data.tarhelycsomagok, 
    })
  }

  componentDidMount() {
    this.loadTarhelyek();
  }

  handleUpload = async () => {
    const { nevInput, meretInput, arInput } = this.state;
    if(nevInput.trim() === '' || meretInput<1 || arInput <1){
      // this.setState()- tel hibaüzenet megjelenítése
      return;
    }

    const adat = {
      nev: nevInput,
      meret: meretInput,
      ar: arInput,
    }

    let response = await fetch('http://localhost:3000/api/tarhely', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adat),
    });

    this.setState({ 
      nevInput: '',
      meretInput: 0,
      arInput: 0,
    })

    await this.loadTarhelyek();
  };

  render() {
    const { nevInput, meretInput, arInput } = this.state;
    return <div id='container'>
    <section className="centered">
    <h2>Új tárhely</h2>
    <input type="text" placeholder='Nev' value={nevInput} onChange={e => this.setState({ nevInput: e.currentTarget.value})} /> <br />
    <input type="number" placeholder='Meret' value={meretInput} onChange={e => this.setState({ meretInput: parseInt(e.currentTarget.value) })}/> <br />
    <input type="number" placeholder='Ar' value={arInput} onChange={e => this.setState({ arInput: parseInt(e.currentTarget.value) })} /> <br />
    <button onClick={this.handleUpload}>Hozzaad</button> <br />
    <h2>Tárhelyek:</h2>
    <div id='items-container'>
    {
          this.state.tarhelyek.map(tarhely => 
            <div className='card'>
              <img src={cloud} />
              <h3>Nev: <span id='card'>{tarhely.nev}</span></h3>
              <h3>Tarhely: <span id='card'>{tarhely.meret} GB</span></h3>
              <h3>Ar: <span id='card'>{tarhely.ar} Ft/ho</span></h3>
            </div>
          )
        }
    </div>
    
    </section>
    </div>
  }
}

export default App;