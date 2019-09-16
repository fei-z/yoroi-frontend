import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Select } from 'react-polymorph/lib/components/Select';
import { SelectSkin } from 'react-polymorph/lib/skins/simple/SelectSkin';
import { defineMessages, intlShape, FormattedHTMLMessage } from 'react-intl';
import SvgInline from 'react-svg-inline';
import ReactToolboxMobxForm from '../../../../utils/ReactToolboxMobxForm';
import LocalizableError from '../../../../i18n/LocalizableError';
import styles from './UnitOfAccountSettings.scss';

const messages = defineMessages({
  unitOfAccountTitle: {
    id: 'settings.unitOfAccount.title',
    defaultMessage: '!!!Currency Conversion',
  },
  note: {
    id: 'settings.unitOfAccount.note',
    defaultMessage: '!!!<strong>Note:</strong> If you change the currency it might change the fee and the total amount received. The rate we use is based on <a href="https://www.cryptocompare.com/" target="_blank" rel="noopener noreferrer">CryptoCompare.com</a>, <a href="https://coinlayer.com/" target="_blank" rel="noopener noreferrer">coinlayer</a> and <a href="https://coinmarketcap.com/" target="_blank" rel="noopener noreferrer">CoinMarketCap</a>.',
  },
  lastUpdated: {
    id: 'settings.unitOfAccount.lastUpdated',
    defaultMessage: '!!!<strong>Last updated:</strong> {lastUpdated}',
  },
  label: {
    id: 'settings.unitOfAccount.label',
    defaultMessage: '!!!Currency',
  },
});

type Props = {|
  onSelect: string=>void,
  isSubmitting: boolean,
  currencies: string,
  currentValue: string,
  error?: ?LocalizableError,
  lastUpdatedTimestamp: ?number,
|};

@observer
export default class CoinPriceCurrencySettings extends Component<Props> {
  static defaultProps = {
    error: undefined
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  form = new ReactToolboxMobxForm({
    fields: {
      coinPriceCurrencyId: {
        label: this.context.intl.formatMessage(messages.label),
      }
    }
  });

  render() {
    const { currencies, isSubmitting, error, currentValue, lastUpdatedTimestamp } = this.props;
    const { intl } = this.context;
    const { form } = this;
    const coinPriceCurrencyId = form.$('coinPriceCurrencyId');
    const componentClassNames = classNames([styles.component, 'currency']);
    const coinPriceCurrencySelectClassNames = classNames([
      styles.currency,
      isSubmitting ? styles.submitCoinPriceCurrencySpinner : null,
    ]);

    const optionRenderer = option => {
      return (
        <div className={styles.optionRow}>
          <div>
            <SvgInline svg={option.svg} className={styles.flag} width="38px" height="38px" />
          </div>
          <div className={styles.optionLabel}>
            <div><strong>{option.value}</strong> - {option.name}</div>
            {option.native ? (
              <div className={styles.optionSmallNative}>native</div>
            ) : (
              <div className={styles.optionSmall}>1 ADA =&nbsp;
                {option.price ? option.price : '-'} {option.value}
              </div>
            )}
          </div>
        </div>
      );
    };

    const lastUpdated = lastUpdatedTimestamp ?
      new Date(lastUpdatedTimestamp).toLocaleString() : '-';

    return (
      <div className={componentClassNames}>
        <h2 className={styles.title}>
          {intl.formatMessage(messages.unitOfAccountTitle)}
        </h2>

        <p><FormattedHTMLMessage {...messages.note} /></p>

        <p><FormattedHTMLMessage {...messages.lastUpdated} values={{ lastUpdated }} /></p>

        <Select
          className={coinPriceCurrencySelectClassNames}
          options={currencies}
          {...coinPriceCurrencyId.bind()}
          onChange={this.props.onSelect}
          skin={SelectSkin}
          value={currentValue}
          optionRenderer={optionRenderer}
        />

        {error && <p className={styles.error}>{intl.formatMessage(error)}</p>}
      </div>
    );
  }
}
