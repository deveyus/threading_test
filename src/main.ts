import { MessagePort, Worker } from "worker_threads";
import { MessageChannel } from "worker_threads";
import os from 'os';
import { randomUUID } from "crypto";

// Let's use half the number of CPU cores available
const USE_THREADS = os.cpus().length / 2

let workers: IWorker[] = [];
let threadQueue = [];

interface IWorker {
    uuid: string,
    parentPort: MessagePort,
    worker: Worker
}

for (let i = 0; i < USE_THREADS; i++) {
    // Create a UUID for each thread
    const uuid = randomUUID();

    // Create the ports that will be used to talk to them
    let { port1: parentPort, port2: workerPort } = new MessageChannel();

    // Create the worker itself
    let worker = new Worker("./build/worker.js", {
        workerData: {
            responsePort: workerPort
        },
        transferList: [workerPort], // Pass the messageport Atomically via a transfer list
    });

    // Sum it all up into a IWorker
    const iWorker = {uuid: uuid, parentPort: parentPort, worker: worker};

    // Add it to the list of workers
    workers.push(iWorker);
}

// Attach an event listener to the 0th parent port for debugging purposes
// print out what we get back.
workers[0]?.parentPort.on("message", (data: any) => console.log(`Got back ${data}`));

// Send a single number, this should likely be an interface so that the worker and the main thread agree on the data structure
workers[0]?.parentPort.postMessage(1);