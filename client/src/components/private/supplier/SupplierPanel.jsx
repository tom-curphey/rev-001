import React from 'react';
import trolley from '../../../images/trolley.svg';
import heart from '../../../images/heart.svg';
import {
  roundNumber,
  convert100gInto1Kg,
  compareSupplierPacketCostToProfilePacketCost
} from '../../../utils/utils';

const SupplierPanel = ({
  selectedIngredient,
  selectedSupplier,
  changeSelectedIngredientPreferredSupplier,
  checkSelectedIngredientPreferredSupplier
}) => {
  // console.log('selectedSupplier', selectedSupplier);
  // console.log('selectedIngredient', selectedIngredient);

  let supplierListHeader;
  let supplierList;

  if (selectedIngredient.suppliers.length !== 0) {
    // console.log('Ingredient has suppliers');
    supplierListHeader = (
      <ul>
        <li>
          <div>Supplier</div>
          <div>100g</div>
          <div>1 Kg</div>
          <div>You Pay</div>
        </li>
      </ul>
    );

    const supplierRow = selectedIngredient.suppliers.map(si => {
      if (selectedSupplier.supplier._id === si.supplier._id) {
        return (
          <li key={selectedSupplier.supplier._id}>
            <div>
              {selectedSupplier.preferred && (
                <img
                  src={heart}
                  alt="Man standing at a bar as an icon to complete venue setup"
                />
              )}
              {selectedSupplier.supplier.displayName}
            </div>
            <div>{roundNumber(si.packetCost)}</div>
            <div>
              {roundNumber(convert100gInto1Kg(si.packetCost))}
            </div>
            <div
              className={compareSupplierPacketCostToProfilePacketCost(
                selectedSupplier.packetCost,
                selectedSupplier.profilePacketCost,
                selectedSupplier.profilePacketGrams
              )}
            >
              {selectedSupplier.profilePacketCost
                ? roundNumber(selectedSupplier.profilePacketCost)
                : '-'}
            </div>
          </li>
        );
      } else {
        // Find current preferred supplier
        const cpSupplier = selectedIngredient.suppliers.filter(
          sis => {
            return sis.preferred === true;
          }
        );

        // console.log('cpSupplier', cpSupplier);

        // if (
        //   cpSupplier.length !== 0 &&
        //   selectedSupplier.preferred &&
        //   selectedSupplier.supplier._id !== cpSupplier[0].supplier._id
        // ) {
        //   console.log('Change Suppliers', cpSupplier);
        //   changeSelectedIngredientPreferredSupplier(cpSupplier[0]);
        // }

        // if (
        //   cpSupplier.length !== 0 &&
        //   selectedSupplier.preferred === false &&
        //   selectedSupplier.supplier._id !==
        //     cpSupplier[0].supplier._id &&
        //   cpSupplier[0].preferred === false
        // ) {
        //   console.log('Change Suppliers', cpSupplier);
        //   checkSelectedIngredientPreferredSupplier(cpSupplier[0]);
        // }

        return (
          <li key={si.supplier._id}>
            <div>
              {si.preferred && (
                <img
                  src={heart}
                  alt="Man standing at a bar as an icon to complete venue setup"
                />
              )}
              {si.supplier.displayName}
            </div>
            <div>{roundNumber(si.packetCost)}</div>
            <div>
              {roundNumber(convert100gInto1Kg(si.packetCost))}
            </div>
            <div
              className={compareSupplierPacketCostToProfilePacketCost(
                si.packetCost,
                si.profilePacketCost,
                si.profilePacketGrams
              )}
            >
              {si.profilePacketCost
                ? roundNumber(si.profilePacketCost)
                : '-'}
            </div>
          </li>
        );
      }
    });
    supplierList = (
      <div className="supplierList">
        <ul>{supplierRow}</ul>
        <p>
          Prices provided for Apple suppliers are the avarage prices
          chefs have paid for this ingredient in the past. They are to
          be used for guidance & do not reflect the current market
          price.
        </p>
      </div>
    );
  } else {
    console.log('Ingredient has no suppliers');
    supplierList = (
      <div className="supplierList">
        <h4>
          {selectedIngredient.displayName} currently has no suppliers
        </h4>
      </div>
    );
  }

  return (
    <section className="supplierPanel">
      <div className="header">
        <h2>{selectedIngredient.displayName} Suppliers</h2>
        {supplierListHeader}
      </div>
      {supplierList}
      <div className="addSupplier">
        <img
          src={trolley}
          alt="Man standing at a bar as an icon to complete venue setup"
        />

        <div className="button">
          <nav
          // className={readyToSaveClass}
          // onClick={this.handleSubmit}
          >
            Add Ingredient Supplier
          </nav>
        </div>
      </div>
    </section>
  );
};

export default SupplierPanel;
