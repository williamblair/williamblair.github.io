/*
 * Static class for logging and debugging
 */
class Debug {
    static Error(message) {
        console.log(message);
        alert(message);
    }
    static Log(message) {
        console.log(message);
    }
}

