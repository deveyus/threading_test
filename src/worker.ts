import { workerData } from "worker_threads";
import { IWorkerMessage } from "./main";

// Alias to make easier to read
const port = workerData.responsePort;

// When we get message, pass it to the onMessage Function
port.on("message", onMessage)

function onMessage(message: IWorkerMessage): void {
    message.data.value++;

    // Send back the results.
    port.postMessage(message);
}