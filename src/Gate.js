import React, { Component, PropTypes } from "react"
import { pick } from "lodash"

const Gate = keyWhitelist => WrappedComponent => class extends Component {
  static propTypes = WrappedComponent.propTypes
  static displayName = `Gate(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`

  state = {
    open: true
  }

  // https://twitter.com/dan_abramov/status/749710501916139520
  cachedProps = {}

  componentWillMount() {
    this.cachedProps = this.props
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open) {
      // only refresh cache if the gate is open
      this.cachedProps = nextProps
    }
  }

  handleGateChange = value => {
    // accept changes from WrappedComponent
    this.setState({ open: value })
  }

  render() {
    // compose props for WrappedComponent from cached and "fresh" props
    const props = {
      ...(this.state.open ? this.props : this.cachedProps),
      ...(!this.state.open && keyWhitelist ? pick(this.props, keyWhitelist) : null)
    }
    return <WrappedComponent {...props} onGateChange={this.handleGateChange} />
  }
}

export default Gate