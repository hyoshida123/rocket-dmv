import React from 'react';
import SearchableDropdownSelect from './SearchableDropdownSelect';
import {callAPI, capitalize} from './../utils';

const FIELDS = [
  'origin',
  'destination',
  'year',
  'major',
];

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        origin: '',
        destination: '',
        year: '',
        major: '',
      },
      origins: {},
      destinations: {},
      years: [],
      majors: {},
    };
    callAPI('origins').then((response) => {
      this.setState({
        origins: response.origins,
      });
    });
  }
  onEntrySelect(fieldChanged, newValue) {
    if (this.state.selected[fieldChanged] !== newValue) {
      const newState = Object.assign(this.state, {});
      delete newState.agreement;
      switch (fieldChanged) {
        case 'origin': {
          delete newState.selected.destination;
          delete newState.selected.year;
          delete newState.selected.major;
          newState.selected.origin = newValue;
          callAPI('destinations', newState.selected).then((response) => {
            const newSelected = Object.assign(this.state.selected, {});
            newSelected.year = response.years[0];
            this.setState({
              destinations: response.destinations,
              selected: newSelected,
              years: response.years,
            });
          });
          break;
        }
        case 'year': {
          delete newState.selected.major;
          newState.selected.year = newValue;
          if (this.state.selected.destination) {
            callAPI('majors', newState.selected).then((response) => {
              this.setState({
                majors: response.majors,
              });
            });
          }
          break;
        }
        case 'destination': {
          delete newState.selected.major;
          newState.selected.destination = newValue;
          if (this.state.selected.year) {
            callAPI('majors', newState.selected).then((response) => {
              this.setState({
                majors: response.majors,
              });
            });
          }
          break;
        }
        case 'major': {
          newState.selected.major = newValue;
          this.props.getAgreement(newState.selected);
          break;
        }
        default: {
          break;
        }
      }
      this.setState(newState);
    }
  }
  render() {
    return (
      <form>
        {FIELDS.map((field, index) => 
          (field === 'year') ? (
            this.state.years.length !== 0 &&
              <div className="input-group" key={index}>
                <select
                  className="form-control"
                  onChange={(selectedYear) => this.onEntrySelect(field, selectedYear)}
                  value={this.state.selected.year}
                >
                  {this.state.years.map((year, index) =>
                    <option key={index}>{year}</option>
                  )}
                </select>
              </div>
          ) : (
            this.state[field + 's'] && Object.keys(this.state[field + 's']).length &&
              <SearchableDropdownSelect
                key={index}
                entries={this.state[field + 's']}
                placeholder={capitalize(field)}
                onEntrySelect={(payload) => this.onEntrySelect(field, payload)}
              />
          )
        )}
      </form>
    );
  }
};