import { Request } from "express"
import { IncomingHttpHeaders } from "http"
import { Socket } from "net"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { Data } from "../types/data/Data"
import { GetDatasReq } from "../types/data/GetDatasReq"
import { getDatas } from "./DataModel"

let mockRequestDefault: Request = {
    app: {} as any,
    aborted: false,
    httpVersion: "1.1",
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    complete: false,
    connection: new Socket(),
    socket: new Socket(),
    headers: {} as IncomingHttpHeaders,
    headersDistinct: {} as NodeJS.Dict<string[]>,
    rawHeaders: [],
    trailers: {} as NodeJS.Dict<string>,
    trailersDistinct: {} as NodeJS.Dict<string[]>,
    rawTrailers: [],
    setTimeout: jest.fn(),
    destroy: jest.fn(),
    readableAborted: false,
    readable: false,
    readableDidRead: false,
    readableEncoding: null,
    readableEnded: false,
    readableFlowing: null,
    readableHighWaterMark: 0,
    readableLength: 0,
    readableObjectMode: false,
    destroyed: false,
    closed: false,
    errored: null,
    _read: jest.fn(),
    read: jest.fn(),
    setEncoding: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    isPaused: jest.fn(),
    unpipe: jest.fn(),
    unshift: jest.fn(),
    wrap: jest.fn(),
    push: jest.fn(),
    _destroy: jest.fn(),
    addListener: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    prependListener: jest.fn(),
    prependOnceListener: jest.fn(),
    removeListener: jest.fn(),
    [Symbol.asyncIterator]: jest.fn(),
    [Symbol.asyncDispose]: jest.fn(),
    pipe: jest.fn(),
    compose: jest.fn(),
    off: jest.fn(),
    removeAllListeners: jest.fn(),
    setMaxListeners: jest.fn(),
    getMaxListeners: jest.fn(),
    listeners: jest.fn(),
    rawListeners: jest.fn(),
    listenerCount: jest.fn(),
    eventNames: jest.fn(),
    body: {},
    query: {},
    params: {},
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    range: jest.fn(),
    accepted: [],
    param: jest.fn(),
    is: jest.fn(),
    protocol: "",
    secure: false,
    ip: "",
    ips: [],
    subdomains: [],
    path: "",
    hostname: "",
    host: "",
    fresh: false,
    stale: false,
    xhr: false,
    cookies: undefined,
    method: "",
    route: undefined,
    signedCookies: undefined,
    originalUrl: "",
    url: "",
    baseUrl: ""
}

// Mocking the required dependencies
jest.mock("mysql2", () => ({
    createConnection: jest.fn(),
}))

// Mocking the database configuration
jest.mock("../../db", () => ({
    dbConfig: {
        // Provide your mock database configuration here
    },
}))

// Mocking the external functions
jest.mock("../utils/Response", () => ({
    baseResp: jest.fn(),
}))

describe("getData", () => {
    // Mocked data for testing
    const mockRequest: JWTRequest = {
        ...mockRequestDefault,
        body: {
            category: "exampleCategory",
            dateFrom: "",
            dateUntil: "",
            documentNumber: "",
            description: ""
        } as GetDatasReq,
        payload: {
            name: "John Doe",
            role: "user",
            username: "exampleUser",
            iat: 1234567890,
            exp: 1234567890,
        },
        setTimeout: jest.fn(),
        destroy: jest.fn(),
        _read: jest.fn(),
        read: jest.fn(),
        setEncoding: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        isPaused: jest.fn(),
        unpipe: jest.fn(),
        unshift: jest.fn(),
        wrap: jest.fn(),
        push: jest.fn(),
        _destroy: jest.fn(),
        addListener: jest.fn(),
        emit: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        removeListener: jest.fn(),
        [Symbol.asyncIterator]: jest.fn(),
        [Symbol.asyncDispose]: jest.fn(),
        pipe: jest.fn(),
        compose: jest.fn()
    }

    const mockCallback = jest.fn()

    // Assuming the actual implementation of baseResp is not important for this test
    const { baseResp } = require("../utils/Response")

    beforeEach(() => {
        // Reset mock functions before each test
        jest.clearAllMocks()
    })

    it("should fetch data from the database and return the expected response", () => {
        // Mock database connection and query result
        const mockResult: Data = {
            id: "1",
            date: "2023-01-01",
            documentNumber: "doc123",
            description: "Test Document",
            file: "example.txt",
            category: "exampleCategory",
            lockerId: "exampleLockerId",
            author: "exampleUser",
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                callback(null, result)
            }),
            end: jest.fn(),
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        getDatas(mockRequest, mockCallback)

        // Assertions

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM data"),
            ["exampleCategory", "exampleUser"],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

})
