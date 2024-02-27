import { AerospikeService } from "./Aerospike";
import Aerospike, { Record } from "aerospike";

const namespace = "test";
const set = 'users';

export class Aerospike_Service extends AerospikeService {

    insertClient = async(record:any):Promise<void> => {
        const key = new Aerospike.Key(namespace, set, record.id);
        try {
            const recordExists = await this.client.exists(key);

            if (!recordExists) {
                console.log("Record does not exists in database");
                console.log("client", this.client);
                await this.client.put(key, record);
            } 
            else {
                console.log("Record exist in database");
                throw new Error("Record exist in database");
            }
        }
        catch (error: any) {
            console.log(error.message);
            throw new Error(error.message)
        }
    }
    readClient = async(record:any):Promise<any> => {
        const key = new Aerospike.Key(namespace, set, record);
        try {
            const recordExists = await this.client.exists(key);
        
            if (recordExists) {
                console.log("Record exists in database");
                console.log("client", key);
                const a = await this.client.get(key);
                return a.bins;
            } else {
                console.log("Record does not exist in database");
                throw new Error("Record does not exist in database");
            }
        } 
        catch (error: any) {
            console.log(error.message);
            throw new Error(error.message)
        }
    }
  getAllClients = async (): Promise<any[]> => {
    const scan = this.client.scan(namespace, set);
    const records: any[] = [];

    try {
        const results = await scan.results();
        
        for await (const record of results) {
            records.push(record.bins);
        }
        
        console.log(`Found ${records.length} records in the database`);
    } catch (error) {
        console.error("Error scanning records:", error);
        throw new Error("Error scanning records");
    }

    return records;
};


    updateClient = async(record:any):Promise<any> => {
        const key = new Aerospike.Key(namespace, set, record.id);
        try {
                console.log("client", key);
                const a = await this.client.put(key,record);
                return record;
            }

        catch (error: any) {
            console.log(error.message);
            throw new Error(error.message)
        }
    }
    deleteClient = async(record:any):Promise<any> => {
        const key = new Aerospike.Key(namespace, set, record);
        try {
            const recordExists = await this.client.exists(key);
            if (recordExists) {
                console.log("Record exists in database");
                console.log("client", key);
                await this.client.remove(key);
            }
            else {
                console.log("Record does not exist in database");
                throw new Error("Record does not exist in database");
            }

        } catch (error: any) {
            console.log(error.message);
            throw new Error(error.message)
        }
    }
    incrementCounter = async (record: any): Promise<void> => {  
        const key = new Aerospike.Key(namespace, set, record.id);
        try {
            const recordExists = await this.client.exists(key);
            if (recordExists) {
                await this.client.operate(key, [
                Aerospike.operations.incr("counter", -5)
            ]);
            console.log(`Incremented counter for record with ID ${record}`);
            }
            else {
                console.log("Record does not exist in database");
                throw new Error("Record does not exist in database");
            }                        
        } catch (error: any) {
            console.error(`Failed to increment counter`, error);
            throw new Error(error.message);
        }
    }
}