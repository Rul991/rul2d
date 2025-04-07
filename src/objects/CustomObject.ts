export default class CustomObject {
    log(): void {
        console.log(this)
    }

    simplify(): {} {
        return {}
    }

    toString(): string {
        let result: string = `${this.constructor.name} {`
        let entries: [string, any][] = Object.entries(this.simplify())

        entries.forEach(([key, value], i) => {
            result += `${key}: ${value.toString()}`
            
            if(i + 1 < entries.length) result += ', '
        })

        result += '}'

        return result
    }

    valueOf(): number {
        return NaN
    }
}