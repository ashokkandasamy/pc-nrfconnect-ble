/* Copyright (c) 2015 Nordic Semiconductor. All Rights Reserved.
 *
 * The information contained herein is property of Nordic Semiconductor ASA.
 * Terms and conditions of usage are described in detail in NORDIC
 * SEMICONDUCTOR STANDARD SOFTWARE LICENSE AGREEMENT.
 *
 * Licensees are granted free, non-transferable use of the information. NO
 * WARRANTY of ANY KIND is provided. This heading must NOT be removed from
 * the file.
 *
 */

'use strict';

import React, { PropTypes } from 'react';

import Component from 'react-pure-render/component';

import ConnectedDevice from './ConnectedDevice';
import CentralDevice from './CentralDevice';
import EnumeratingAttributes from './EnumeratingAttributes';

import ServiceItem from './ServiceItem';

export default class DeviceDetailsView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            adapter,
            device,
            selected, // instanceId for the selected component
        } = this.props;

        const {
            instanceId,
            name,
            address,
            role,
        } = device;

        const centralPosition = {
            x: 0,
            y: 0,
        };

        if (device && role === undefined) {
            const {
                device: {
                    advertising,
                },
                onSelectComponent,
                onShowAdvertisingSetupDialog,
                onToggleAdvertising,
            } = this.props;
            /*TODO: Add local server*/
            return (
                <CentralDevice id={instanceId + '_details'}
                               position={centralPosition}
                               name={name}
                               address={address}
                               advertising={advertising}
                               selected={selected}
                               onShowSetupDialog={onShowAdvertisingSetupDialog}
                               onToggleAdvertising={onToggleAdvertising} />
            );
        }

        const {
            onSelectComponent,
            onToggleAttributeExpanded,
            onReadCharacteristic,
            onWriteCharacteristic,
            onReadDescriptor,
            onWriteDescriptor,
            onDisconnectFromDevice,
            onPairWithDevice,
            onUpdateDeviceConnectionParams,
        } = this.props;

        const deviceDetail = this.props.deviceDetails.devices.get(instanceId);

        if (!deviceDetail) {
            return <div/>;
        }

        const connectedDevice = (<ConnectedDevice id={instanceId + '_details'}
                                                 sourceId={adapter.instanceId + '_details'}
                                                 key={instanceId}
                                                 device={device}
                                                 selected={selected}
                                                 layout="vertical"
                                                 onSelectComponent={onSelectComponent}
                                                 onDisconnect={() => onDisconnectFromDevice(device)}
                                                 onPair={() => onPairWithDevice(device)}
                                                 onConnectionParamsUpdate={() => onUpdateDeviceConnectionParams(device)}/>);


        if (deviceDetail && deviceDetail.discoveringChildren) {
            return (
                <div className="device-details-view" id={instanceId + '_details'} style={this.props.style}>
                    {connectedDevice}
                    <EnumeratingAttributes bars={1} />
                </div>
            );
        } else {
            const children = deviceDetail.get('children');
            const childrenList = [];

            if (children) {
                children.forEach(service => {
                    childrenList.push(<ServiceItem key={service.instanceId}
                                                   item={service}
                                                   selectOnClick={true}
                                                   selected={selected}
                                                   onSelectAttribute={onSelectComponent}
                                                   onToggleAttributeExpanded={onToggleAttributeExpanded}
                                                   onReadCharacteristic={onReadCharacteristic}
                                                   onWriteCharacteristic={onWriteCharacteristic}
                                                   onReadDescriptor={onReadDescriptor}
                                                   onWriteDescriptor={onWriteDescriptor} />
                    );
                });
            }

            return (
                <div className="device-details-view" id={instanceId + '_details'} style={this.props.style}>
                    {connectedDevice}
                    <div className="service-items-wrap">
                        {childrenList}
                    </div>
                </div>
            );
        }
    }
}

DeviceDetailsView.propTypes = {
    key: PropTypes.string.isRequired, // Can be null/undefined... ?
    device: PropTypes.object.isRequired,
    selected: PropTypes.string.isRequired, // Can be null/undefined... ?
    onSelectComponent: PropTypes.func.isRequired,
    onToggleAttributeExpanded: PropTypes.func.isRequired,
    onUpdateDeviceConnectionParams: PropTypes.func,
    adapter: PropTypes.object,
    onReadCharacteristic: PropTypes.func,
    onWriteCharacteristic: PropTypes.func,
    onReadDescriptor: PropTypes.func,
    onWriteDescriptor: PropTypes.func,
    onDisconnectFromDevice: PropTypes.func,
    onPairWithDevice: PropTypes.func,
    onShowAdvertisingSetupDialog: PropTypes.func,
    onToggleAdvertising: PropTypes.func,
};
