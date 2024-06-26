import { Application } from "express"
import { IncomingHttpHeaders } from "http"
import { Socket } from "net"
import path from "path"
import { Readable } from "stream"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { Data } from "../types/data/Data"
import { generateUUID } from "../utils/UUID"
import { download, getDatas, remove, update, upload } from "./DataModel"

// Mocking the required dependencies
jest.mock("mysql2", () => ({
    createConnection: jest.fn()
}))

// Mocking the database configuration
jest.mock("../../db", () => ({
    dbConfig: {
        // Provide your mock database configuration here
    }
}))

// Mocking the external functions
jest.mock("../utils/Response", () => ({
    callback: jest.fn(),
    baseResp: jest.fn(),
    conflictResp: jest.fn()
}))

describe("DataModel", () => {
    // Mocked data for testing
    const mockRequest: JWTRequest = {
        query: {},
        payload: {
            username: "testUser",
            name: "testName",
            role: "testRole"
        },
        file: {
            filename: "testFile.jpg",
            buffer: Buffer.from([]),
            destination: "testDestination",
            fieldname: "testFieldname",
            mimetype: "testMimetype",
            originalname: "testOriginalName",
            path: "testPath",
            size: 10,
            stream: new Readable(),
            encoding: "utf-8"
        },
        params: {
            id: "testId"
        },
        body: {
            categoryId: "testCategoryId",
            lockerId: "testLockerId",
            date: "2023-01-01",
            documentNumber: "testDocumentNumber",
            description: "testDescription",
            uuid: generateUUID()
        },
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
        baseUrl: "",
        app: jest.fn() as unknown as Application,
        aborted: false,
        httpVersion: "",
        httpVersionMajor: 0,
        httpVersionMinor: 0,
        complete: false,
        connection: new Socket,
        socket: new Socket,
        headers: undefined as unknown as IncomingHttpHeaders,
        headersDistinct: undefined as unknown as NodeJS.Dict<string[]>,
        rawHeaders: [],
        trailers: undefined as unknown as NodeJS.Dict<string>,
        trailersDistinct: undefined as unknown as NodeJS.Dict<string[]>,
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
        eventNames: jest.fn()
    }

    const mockCallback = jest.fn()

    beforeEach(() => {
        // Reset mock functions before each test
        jest.clearAllMocks()
    })

    it("getData()", () => {
        // Mock database connection and query result
        const mockResult: Data = {
            id: "1",
            date: "2023-01-01",
            documentNumber: "doc123",
            description: "testDescription",
            file: "testFile.pdf",
            categoryId: "testCategoryId",
            lockerId: "testLockerId",
            author: "testUser"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        getDatas(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM data"),
            [`%%`, `%%`, `%%`, `%%`, mockRequest.payload?.username],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("upload()", () => {
        // Mock database connection and query result
        const mockResult: Data = {
            id: "1",
            date: "2023-01-01",
            documentNumber: "doc123",
            description: "testDescription",
            file: "testFile.pdf",
            categoryId: "testCategoryId",
            lockerId: "testLockerId",
            author: "testUser"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        upload(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO data"),
            [mockRequest.body.uuid, mockRequest.body.date, mockRequest.body.documentNumber, mockRequest.body.description, mockRequest.body.categoryId, mockRequest.body.lockerId, mockRequest.body.uuid + path.extname(mockRequest.file?.filename ?? ""), mockRequest.payload?.username],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("download()", () => {
        // Mock database connection and query result
        const mockResult: Data = {
            id: "1",
            date: "2023-01-01",
            documentNumber: "doc123",
            description: "testDescription",
            file: "testFile.pdf",
            categoryId: "testCategoryId",
            lockerId: "testLockerId",
            author: "testUser"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        download(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM data"),
            [mockRequest.params.id],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("update()", () => {
        // Mock database connection and query result
        const mockResult: Data = {
            id: "1",
            date: "2023-01-01",
            documentNumber: "doc123",
            description: "testDescription",
            file: "testFile.pdf",
            categoryId: "testCategoryId",
            lockerId: "testLockerId",
            author: "testUser"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        update(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE data SET"),
            [mockRequest.body.date, mockRequest.body.documentNumber, mockRequest.body.description, mockRequest.params.id],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("remove()", () => {
        // Mock database connection and query result
        const mockResult: Data = {
            id: "1",
            date: "2023-01-01",
            documentNumber: "doc123",
            description: "testDescription",
            file: "testFile.pdf",
            categoryId: "testCategoryId",
            lockerId: "testLockerId",
            author: "testUser"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        remove(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM data"),
            [mockRequest.params.id],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })
})
