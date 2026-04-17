import { applyDecorators } from "@nestjs/common";
import {
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";

export const SwaggerUpdateOrCreateAthleteStock = () =>
    applyDecorators(
        ApiTags("Athlete Stock"),
        ApiOperation({
            summary: "Update or Create Athlete Stock",
            description:
                "Assign or update stock for an athlete based on the available inventory. Validates stock availability and updates existing records or creates new assignments.",
        }),
        ApiBody({
            description: "Payload to update or create stock for an athlete.",
            schema: {
                example: {
                    athleteId: "uuid-athlete-id",
                    stockData: [
                        {
                            categoryId: "uuid-category-id",
                            size: "M",
                            quantity: 3,
                        },
                        {
                            categoryId: "uuid-category-id",
                            size: "L",
                            quantity: 2,
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "The stock has been successfully updated or created.",
            schema: {
                example: {
                    message: "Stock updated or created successfully",
                    updatedStocks: [
                        {
                            id: "uuid-stock-1",
                            athleteId: "uuid-athlete-id",
                            categoryId: "uuid-category-id",
                            size: "M",
                            quantity: 3,
                        },
                        {
                            id: "uuid-stock-2",
                            athleteId: "uuid-athlete-id",
                            categoryId: "uuid-category-id",
                            size: "L",
                            quantity: 2,
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Validation error or insufficient stock.",
            schema: {
                example: {
                    message:
                        "Validation error: Insufficient stock for categoryId 'uuid-category-id' and size 'M'. Required: 3, Available: 2",
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Athlete or stock category not found.",
            schema: {
                example: {
                    message: "Athlete with ID 'uuid-athlete-id' not found.",
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error while processing the request.",
            schema: {
                example: {
                    message:
                        "An unexpected error occurred while processing the stock update.",
                },
            },
        })
    );

export const SwaggerGetAthleteStockFields = () =>
    applyDecorators(
        ApiTags("Athlete Stock"),
        ApiOperation({
            summary: "Retrieve stock fields for an athlete",
            description:
                "Fetch a list of stock fields for the specified athlete, including size and quantity information based on their assigned categories and sizes.",
        }),
        ApiQuery({
            name: "athleteId",
            type: String,
            description: "The unique identifier of the athlete",
            required: true,
            example: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
        }),
        ApiResponse({
            status: 200,
            description:
                "Successfully fetched the stock fields for the athlete.",
            schema: {
                example: [
                    {
                        categoryId: "uuid-category-1",
                        categoryName: "Shoes",
                        size: "US 8",
                        quantity: 2,
                    },
                    {
                        categoryId: "uuid-category-2",
                        categoryName: "T-Shirt",
                        size: "M",
                        quantity: 1,
                    },
                    {
                        categoryId: "uuid-category-3",
                        categoryName: "Pants",
                        size: "L",
                        quantity: 0,
                    },
                ],
            },
        }),
        ApiResponse({
            status: 404,
            description: "The specified athlete was not found.",
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error while fetching stock fields.",
        })
    );
export const SwaggerGetClothingStatus = () =>
    applyDecorators(
        ApiTags("Athlete Stock"),
        ApiOperation({
            summary: "Retrieve athlete clothing statuses",
            description:
                "Get the clothing statuses for athletes based on sport ID with pagination.",
        }),
        ApiQuery({
            name: "sportId",
            type: String,
            description: "The ID of the sport to filter athletes.",
            required: true,
            example: "3ec8c5cf-b136-47fc-b8bb-0ab6a98cb23c",
        }),
        ApiQuery({
            name: "page",
            type: Number,
            description: "Page number for pagination.",
            required: false,
            example: 1,
        }),
        ApiQuery({
            name: "limit",
            type: Number,
            description: "Number of items per page.",
            required: false,
            example: 10,
        }),
        ApiResponse({
            status: 200,
            description: "Clothing statuses retrieved successfully.",
            schema: {
                example: {
                    success: true,
                    message: "Athlete clothing statuses retrieved successfully",
                    data: [
                        {
                            athleteId: "uuid-athlete-id",
                            name: "John Doe",
                            category: "Male, 25",
                            joinedDate: "2024-01-01",
                            status: "NEEDS",
                            requirements: [
                                { size: "Shoes: M", shortage: 2 },
                                { size: "Shirt: L", shortage: 1 },
                            ],
                        },
                    ],
                    total: 20,
                    page: 1,
                    limit: 10,
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Invalid sport ID or pagination parameters.",
        }),
        ApiResponse({
            status: 500,
            description:
                "An error occurred while retrieving clothing statuses.",
        })
    );

export function SwaggerGetClothesNeeded() {
    return applyDecorators(
        ApiOperation({
            summary: "Retrieve clothes needed for a sport category",
            description:
                "This endpoint retrieves a detailed list of clothes needed for a specified sport category, considering shortages based on assigned quantities and available stock. It also indicates whether the required sizes are available in stock or not.",
        }),
        ApiParam({
            name: "sportId",
            type: String,
            description: "The ID of the sport for which clothes are needed",
            example: "d2f8abc5-9c81-4c0a-9295-64732f3ae879",
        }),
        ApiResponse({
            status: 200,
            description: "List of clothes needed successfully retrieved",
            schema: {
                example: {
                    clothesNeeded: [
                        {
                            category: "Shoes",
                            sizes: [
                                {
                                    size: "US 8",
                                    quantity: 4,
                                    inStock: false,
                                },
                                {
                                    size: "US 9",
                                    quantity: 2,
                                    inStock: true,
                                },
                            ],
                        },
                        {
                            category: "T-Shirts",
                            sizes: [
                                {
                                    size: "M",
                                    quantity: 5,
                                    inStock: false,
                                },
                                {
                                    size: "L",
                                    quantity: 3,
                                    inStock: true,
                                },
                            ],
                        },
                        {
                            category: "Pants",
                            sizes: [
                                {
                                    size: "XS",
                                    quantity: 4,
                                    inStock: true,
                                },
                            ],
                        },
                    ],
                    summary: {
                        allIsGood: 10,
                        notDelivered: 5,
                        needsClothes: 12,
                    },
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Sport not found",
            schema: {
                example: {
                    message:
                        "Sport with ID 'd2f8abc5-9c81-4c0a-9295-64732f3ae879' not found.",
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error while processing the request.",
            schema: {
                example: {
                    message:
                        "An unexpected error occurred while retrieving the clothes needed.",
                },
            },
        })
    );
}

export function SwaggerAddSize() {
    return applyDecorators(
        ApiOperation({ summary: "Add a new size to a category" }),
        ApiBody({
            description: "Payload to add a new size to a specific category",
            schema: {
                example: {
                    categoryId: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
                    size: "XL",
                    requiredQuantity: 1,
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "New size added successfully",
        }),
        ApiResponse({
            status: 400,
            description: "Invalid request payload",
        }),
        ApiResponse({
            status: 404,
            description: "Category not found",
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error",
        })
    );
}

export function SwaggerGetStockCategories() {
    return applyDecorators(
        ApiOperation({ summary: "Retrieve stock categories" }),
        ApiQuery({
            name: "sportId",
            required: true,
            type: String,
            description: "Filter categories by sport ID",
            example: "d2f8abc5-9c81-4c0a-9295-64732f3ae879",
        }),
        ApiResponse({
            status: 200,
            description: "Stock categories retrieved successfully",
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error",
        })
    );
}

export function SwaggerGetStock() {
    return applyDecorators(
        ApiOperation({
            summary:
                "Retrieve stock items with optional filters and pagination",
        }),
        ApiQuery({
            name: "categoryId",
            required: false,
            type: String,
            description: "Filter by category ID",
            example: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
        }),
        ApiQuery({
            name: "sportId",
            required: false,
            type: String,
            description: "Filter by sport ID",
            example: "d2f8abc5-9c81-4c0a-9295-64732f3ae879",
        }),
        ApiQuery({
            name: "page",
            required: false,
            type: Number,
            description: "Page number for pagination",
            example: 1,
        }),
        ApiQuery({
            name: "limit",
            required: false,
            type: Number,
            description: "Items per page",
            example: 10,
        }),
        ApiResponse({
            status: 200,
            description: "Stock items retrieved successfully",
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error",
        })
    );
}

export function SwaggerAddStock() {
    return applyDecorators(
        ApiOperation({ summary: "Add a new stock item" }),
        ApiBody({
            description: "Payload to add a new stock item",
            schema: {
                example: {
                    sportId: "f2d1a67b-d1ef-4d1a-8c7a-92bb1c1e401d",
                    categoryId: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
                    measurementUnit: "EU",
                    sizeOptions: [
                        { size: "L", quantity: 100 },
                        { size: "XL", quantity: 50 },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Stock item added successfully",
            schema: {
                example: {
                    success: true,
                    message: "Stock item added successfully.",
                    data: {
                        id: "uuid-stock-id",
                        sportId: "f2d1a67b-d1ef-4d1a-8c7a-92bb1c1e401d",
                        categoryId: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
                        measurementUnit: "EU",
                        sizeOptions: [
                            { size: "L", quantity: 100 },
                            { size: "XL", quantity: 50 },
                        ],
                        totalQuantity: 150,
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Validation error in request payload.",
            schema: {
                example: {
                    success: false,
                    message: "Validation error: sportId must be a valid UUID.",
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Category or sport not found.",
            schema: {
                example: {
                    success: false,
                    message:
                        "Category with ID 'c3f1ab29-9d87-4c9f-bc7b-9e673ce98356' not found.",
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error while adding stock.",
            schema: {
                example: {
                    success: false,
                    message: "An unexpected error occurred while adding stock.",
                },
            },
        })
    );
}

export const SwaggerUpdateStock = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update a stock item",
            description:
                "Updates stock item details, including a list of size options and measurement unit.",
        }),
        ApiParam({
            name: "id",
            description: "The ID of the stock item to update.",
            example: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
        }),
        ApiBody({
            description: "Payload for updating stock item details.",
            schema: {
                example: {
                    categoryId: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
                    measurementUnit: "EU",
                    sizeOptions: [
                        { size: "M", quantity: 150 },
                        { size: "L", quantity: 100 },
                        { size: "XL", quantity: 50 },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Stock updated successfully.",
            schema: {
                example: {
                    success: true,
                    message: "Stock updated successfully",
                    data: {
                        id: "uuid-stock-id",
                        sizeOptions: [
                            { size: "M", quantity: 150 },
                            { size: "L", quantity: 100 },
                            { size: "XL", quantity: 50 },
                        ],
                        totalQuantity: 300,
                        measurementUnit: "EU",
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Validation error or invalid size options.",
        }),
        ApiResponse({
            status: 404,
            description: "Stock or category not found.",
        })
    );

export function SwaggerDeleteStock() {
    return applyDecorators(
        ApiOperation({ summary: "Delete a stock item" }),
        ApiParam({
            name: "id",
            type: String,
            description: "The ID of the stock item to delete",
            example: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
        }),
        ApiResponse({
            status: 200,
            description: "Stock item deleted successfully",
        }),
        ApiResponse({
            status: 404,
            description: "Stock item not found",
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error",
        })
    );
}
export const SwaggerGetStockSummarizedData = () =>
    applyDecorators(
        ApiTags("Stock"),
        ApiOperation({
            summary: "Get summarized stock data",
            description:
                "Retrieves summarized stock data by category, including total quantities and size-wise breakdowns. Optionally, you can filter by sport ID.",
        }),
        ApiQuery({
            name: "sportId",
            type: String,
            required: false,
            description: "Filter summarized data by sport ID.",
            example: "d2f8abc5-9c81-4c0a-9295-64732f3ae879",
        }),
        ApiResponse({
            status: 200,
            description: "Summarized stock data retrieved successfully.",
            schema: {
                example: {
                    success: true,
                    message: "Summarized stock data retrieved successfully",
                    data: [
                        {
                            categoryId: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
                            categoryName: "Shoes",
                            totalQuantity: 45,
                            sizeBreakdown: [
                                { size: "S", quantity: 10 },
                                { size: "M", quantity: 20 },
                                { size: "L", quantity: 15 },
                            ],
                        },
                        {
                            categoryId: "d3f2bc29-8d47-4c9f-bc8c-9d1234ab5678",
                            categoryName: "Pants",
                            totalQuantity: 0,
                            sizeBreakdown: [
                                { size: "XS", quantity: 0 },
                                { size: "S", quantity: 0 },
                                { size: "M", quantity: 0 },
                            ],
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Sport or categories not found.",
            schema: {
                example: {
                    success: false,
                    message: "No categories found for the given sport ID.",
                },
            },
        }),
        ApiResponse({
            status: 500,
            description:
                "Internal server error while retrieving summarized stock data.",
            schema: {
                example: {
                    success: false,
                    message: "An unexpected error occurred.",
                },
            },
        })
    );
