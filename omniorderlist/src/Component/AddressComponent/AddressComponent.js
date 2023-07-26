import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Input } from 'antd';

const AddressComponent = ({ setAd }) => {
    const inputSearchaddressRef = useRef(null)

    const addressInfoObj = () => {
        return { addressLine1: "", addressLine2: "", zipcode: "", city: "", state: "", country: "", county: "", streetAddress: '' }
    }



    const loginUserId = sessionStorage.getItem("loggedUserId");
    const logUser = { createdBy: loginUserId, updatedBy: loginUserId };
    const [loggedInId, setloggedInId] = useState('')
    const [addressInfo, setaddressInfo] = useState({ ...addressInfoObj() })
    console.log('addressInfoaddressInfo', addressInfo)

    const onhandleChangeAddress = () => {
        initMapScript().then(() => initAutoComplete());
        if (inputSearchaddressRef.current.value !== "") {
            if (inputSearchaddressRef.current.value > 0) {
                // showClearButton = true;
            }
        }
    };

    const initAutoComplete = () => {
        if (!inputSearchaddressRef.current) return;
        const autocomplete = new window.google.maps.places.Autocomplete(inputSearchaddressRef.current);
        autocomplete.setFields(["address_component", "geometry"]);
        autocomplete.addListener("place_changed", () =>
            onChangeAddress(autocomplete)
        );
    };

    const onChangeAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        const lat = place?.geometry?.location?.lat();
        const long = place?.geometry?.location?.lng();
        setAddressfun(extractAddress(place));
    };

    const extractAddress = (place) => {
        const address = {
            city: "",
            state: "",
            zip: "",
            county: "",
            country: "",
            plain() {
                const city = this.city ? this.city + ", " : "";
                const zip = this.zip ? this.zip + ", " : "";
                const county = this.county ? this.county + "," : "";
                const state = this.state ? this.state + ", " : "";
                return city + zip + state + this.country;
            },
        };

        if (Array.isArray(place?.address_components)) {
            place.address_components.forEach((component) => {
                const types = component.types;
                const value = component.long_name;

                address.city = types.includes("locality") ? value : address?.city;
                address.state = types.includes("administrative_area_level_1") ? value : address?.state;
                address.county = types.includes("administrative_area_level_2") ? value : address?.county;
                address.zip = types.includes("postal_code") ? value : address?.zip;
                address.country = types.includes("country") || types.includes("county") ? value : address?.country;
            });
        }
        return address;
    };

    const setAddressfun = (address) => {
        const addressInfoDet = {
            city: address?.city,
            county: address?.county,
            state: address?.state,
            zipcode: address?.zip,
            country: address?.country,
            addressLine2: "",
            addressLine1: inputSearchaddressRef?.current?.value,
            createdBy: loggedInId,
            streetAddress: inputSearchaddressRef?.current?.value?.substring(0, inputSearchaddressRef?.current?.value?.indexOf(",")),
            addressTypeId: 1
        };
        setAd(addressInfoDet)
        setaddressInfo({ ...addressInfoDet });
    };

    const mapApi = "https://maps.googleapis.com/maps/api/js";


    function loadAsyncScript(src) {
        return new Promise((resolve) => {
            const script = document?.createElement('script');
            Object?.assign(script, {
                type: "text/javascript",
                async: true,
                src
            })
            script?.addEventListener("load", () => resolve(script));
            document?.head?.appendChild(script);
        })
    }

    const initMapScript = () => {
        
        if (window.google) {
            return Promise.resolve();
        }
        const src = `${mapApi}?key=${'AIzaSyBaUn22pwovCzOxH7Uthivbd8_ScMkaEAI'}&libraries=places&v=weekly`;
        console.log(src,"srcsrcsrc")
        return loadAsyncScript(src);
    }
    return (
        <div>
            <Row>
                <Col span={24} className="w-100">
                    <Input
                        ref={inputSearchaddressRef}
                        type="text"
                        placeholder="Enter Primary Address"
                        name="Address"
                        // autoComplete="off"
                        id="Address"
                        onChange={onhandleChangeAddress}
                        className="address-info-textbox"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default AddressComponent;
