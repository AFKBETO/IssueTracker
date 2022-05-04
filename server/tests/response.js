function Response() {
    this.data = {
    },
    this.status = (status) => {
        this.data.status = status
        return this
    },
    this.send = (data) => {
        const keys = Object.keys(data)
        for (var key of keys) {
            this.data[key] = data[key]
        }
    }
}

module.exports = Response