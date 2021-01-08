import React, { Component } from 'react';
import { Highlight, PoweredBy } from 'react-instantsearch-dom';
import AutoSuggest from 'react-autosuggest';
import { connectAutoComplete, connectStateResults } from 'react-instantsearch/connectors';
import { Link } from "react-router-dom";

const searchIcon = require('../../../assets/icons/search-icon.png').default;

class AutoComplete extends Component {


  constructor(props) {
    super(props);
    this.state = {
      value: this.props.currentRefinement,
      noSuggestions: false,
      hasBeenBlured: false
    };
    this.handleClick = this.handleClick.bind(this);


  }

  onChange = (_, { newValue }) => {
    if (!newValue) {
      this.setState({ value: "" })
      this.setState({
        noSuggestions: false
      })
    }
    this.setState({
      value: newValue,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { searchResults } = this.props
    const hasResults = searchResults && searchResults.nbHits !== 0;
    const nbHits = searchResults && searchResults.nbHits;
    const isInputBlank = this.state.value.trim() === '';

    if (prevProps.searchResults !== searchResults) {
      if (!hasResults && nbHits === 0 && !isInputBlank) {
        this.setState({
          noSuggestions: true
        })
      }
      if (hasResults && nbHits >= 1) {
        this.setState({
          noSuggestions: false,
          hasBeenBlured: false,
        })
      }
    }

  }


  onSuggestionsFetchRequested = ({ value }) => {
    this.props.refine(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({ noSuggestions: false })
    this.props.refine();
  };

  getSuggestionValue(hit) {
    return hit.name;
  }


  renderSuggestion = (hit) => {
    if (hit) {
      const subtitle = hit.parent && hit.parent.length > 0 && hit.parent.map(p => p.name) + " > ";
      return (
        <div>
          <div className="suggestion-result-container">
            <div className="suggestion-result-category">
              {hit.type}
            </div>
            <div className='vertical-divider' />
            <div className='highlight-container'>
              {subtitle &&
              <span className='subtitle'>{subtitle}</span>
              }
              <Highlight attribute="name" hit={hit} tagName="strong" />
            </div>
          </div>
        </div>
      )
    }
  };

  renderFullSearch = () => {
    const query = this.props.currentRefinement;
    return (<div className="open-more-result"><a href={'/search?q=' + query}>See more results</a></div>)

  }

  renderSuggestionsContainer = ({ containerProps, children, query }) => (
    <div {...containerProps}>
      {<div className="suggestion-header">
        Documentation
        <hr />
      </div>}
      {children}
      <div className="suggestion-footer">
        {this.renderFullSearch()}

        <PoweredBy />
      </div>
    </div>
  );

  onSuggestionSelected = (_, { suggestion }) => {
    this.setState({ hasBeenBlured: true })
    window.location.href = suggestion.uri
  };

  onSuggestionCleared = () => {
    this.setState({ value: "" })
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  handleClick(e) {
    if (this.node && this.node.contains(e.target)) {
      window.location.href = "/contact/new-request"
    } else {
      this.onBlur()
    }
  }

  onBlur = () => {
    this.setState({ value: "" });
    this.setState({ hasBeenBlured: true });
  };
  onFocus = () => {
    this.setState({ hasBeenBlured: false });
  }

  setDisplay = () => {
    if (this.state.noSuggestions && !this.state.hasBeenBlured) {
      return { display: "block" }
    } else {
      return { display: "none" }
    }
  };

  render() {
    const { hits } = this.props;
    const { value } = this.state;
    const inputProps = {
      placeholder: 'Search...',
      onChange: this.onChange,
      onFocus: this.onFocus,
      value,
    };
    return (

      <div className="main-search-container">
        <img className="icon" src={searchIcon} alt="icon" />
        <AutoSuggest
          suggestions={hits}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionCleared={this.onSuggestionCleared}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          focusFirstSuggestion={true}
          inputProps={inputProps}
          highlightFirstSuggestion={true}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
        />
        {


          <div ref={node => this.node = node} style={this.setDisplay()} className="no-suggestions">
            No results found for {this.state.value}. Make a request
            <span style={{ color: "rgb(32, 113, 181)" }}> here</span>
          </div>
        }
      </div>
    );
  }
}

export default connectAutoComplete(connectStateResults(AutoComplete))

