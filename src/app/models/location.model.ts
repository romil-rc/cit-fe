export class LocationModel {
    _id: string;
    locationName: string;
    address: {
        addressLine1: string,
        addressLine2: string,
        suburb: string,
        city: string,
        state: string,
        country: string,
        county: string,
        pincode: number
    };
    coordinates: {
        latitude: number,
        longitude: number
    };
    formattedAddress: string;
    locationId: string;
    capacity: number;
    accessibility: string;
    photos: string[];
    openingHours: number;
    events: string[];
    facilities: string;
    parking: boolean;
    contactInfo: {
        email: string,
        phoneNumber: number
    };
    rating: number;
    reviews: string;
    isActive: boolean;
    isDeleted: boolean;

    constructor(data: LocationModel) {
        this._id = data?._id;
        this.locationName = data.locationName || 'Default';
        this.address = {
            addressLine1: data.address.addressLine1,
            addressLine2: data.address.addressLine2,
            suburb: data.address.suburb,
            city: data.address.city,
            state: data.address.state,
            country: data.address.country,
            county: data.address.county,
            pincode: data.address.pincode
        };
        this.coordinates = {
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude
        };
        this.formattedAddress = data.formattedAddress;
        this.locationId = data.locationId;
        this.capacity = data.capacity;
        this.accessibility = data.accessibility ? data.accessibility : 'bus';
        this.photos = data.photos;
        this.openingHours = data.openingHours;
        this.events = data.events;
        this.facilities = data.facilities;
        this.parking = data.parking ? data.parking : false;
        this.contactInfo = {
            email: data.contactInfo.email,
            phoneNumber: data.contactInfo.phoneNumber
        };
        this.rating = data.rating;
        this.reviews = data.reviews;
        this.isActive = data.isActive ? data.isActive : true;
        this.isDeleted = data.isDeleted ? data.isDeleted : false;
    }
}