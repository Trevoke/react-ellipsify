'use strict';
var React = require('react/addons');

// this should be the entry point to your library
module.exports = React.createClass({
    displayName: 'Ellipsify',

    propTypes: {
        visibleItems: React.PropTypes.number,
        separator: React.PropTypes.string,
        more: React.PropTypes.string,
        moreClass: React.PropTypes.string,
        atFront: React.PropTypes.bool,
    },

    getDefaultProps() {
      return {
        visibleItems: 5,
        separator: ' ',
        more: '…',
        moreClass: 'more',
        atFront: true,
      };
    },

    render() {
        return <div>{ellipsify(this.props)}</div>;
    },
});

function ellipsify(options) {
    return traverse(options.children, {
        visible: 0,
    });

    function traverse(children, memo) {
        return React.Children.map(children, (child) => {
            var grandChildren = child && child.props && child.props.children;

            if(grandChildren) {
                child.props.children = traverse(grandChildren, memo);
            }
            else {
                var partsLeft = options.visibleItems - memo.visible;
                var parts = child.split(options.separator);

                if(!partsLeft) {
                    return '';
                }

                // longer section than parts left, go to zero and slice
                if(parts.length > partsLeft) {
                    // slice + combine, memo to max
                    memo.visible = options.visibleItems;

                    return parts.slice(0, partsLeft).join(options.separator);
                }
                // excess parts left, add to memo and return whole
                else if(parts.length) {
                    memo.visible += parts.length;

                    return parts.join(options.separator);
                }

                return '';
            }

            return child;
        });
    }
}
