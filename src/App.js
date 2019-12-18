import React from 'react';
import './App.css';

const applyUpdateResult = result => prevState => ({
  hits: [...prevState.hits, ...result.hits],
  page: result.page,
});

const applySetResult = result => prevState => ({
  hits: result.hits,
  page: result.page,
});

const getHackerNewsUrl = (value, page) =>
  `https://hn.algolia.com/api/v1/search?query=${value}&page=${page}&hitsPerPage=100`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      page: null,
    };
  }

  onInitialSearch = e => {
    e.preventDefault();
    const { value } = this.input;
    if (value === '') {
      return;
    }
    this.fetchStories(value, 0);
  };

  fetchStories = (value, page) =>
    fetch(getHackerNewsUrl(value, page))
      .then(response => response.json())
      .then(result => this.onSetResult(result, page));
  onSetResult = (result, page) =>
    page === 0
      ? this.setState(applySetResult(result))
      : this.setState(applyUpdateResult(result));

  render() {
    return (
      <div className='page'>
        <div className='interactions'>
          <form type='submit' onSubmit={this.onInitialSearch}>
            <input type='text' ref={node => (this.input = node)} />
            <button type='submit'>Search</button>
          </form>
        </div>
        <List list={this.state.hits} />
      </div>
    );
  }
}

const List = ({ list }) => (
  <div className='list'>
    {list.map(item => (
      <div className='list-row' key={item.objectID}>
        <a href={item.url}>{item.title}</a>
      </div>
    ))}
  </div>
);
export default App;
