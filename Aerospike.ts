import Aerospike from 'aerospike';

export class AerospikeService {

    private config: {hosts: string} = {
        hosts: 'localhost:3000',
    };
    client: any;

    constructor() {
        this.connectAerospike();
    }

    getClient = async () => {
        console.log("clientConfig", this.client);
        if (!this.client) {
            throw new Error("Aerospike error has occoured");
        }
        return this.client;
    }
        
    connectAerospike = async () => {
        this.client = await Aerospike.connect(this.config);
    }
}