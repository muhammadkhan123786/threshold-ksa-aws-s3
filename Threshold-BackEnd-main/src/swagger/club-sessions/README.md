# Club Sessions API Documentation

## Overview

The Club Sessions API provides comprehensive functionality for managing training sessions in sports clubs. It allows coaches and staff to create, manage, and track training sessions, including player performance and results.

## Base URL

```
/club-sessions
```

## API Structure

### Team-Specific Endpoints

These endpoints manage sessions at the team level.

#### Create Session

-   **POST** `/team/{teamId}`
-   Creates a new training session for a specific team
-   Requires session details and template reference
-   Returns the created session object

#### List Team Sessions

-   **GET** `/team/{teamId}`
-   Returns all sessions for a team
-   Can be filtered by status
-   Sorted chronologically

#### Upcoming Sessions

-   **GET** `/team/{teamId}/upcoming`
-   Lists future scheduled sessions
-   Only includes NOT_STARTED sessions
-   Optional days parameter to limit the range

#### Completed Sessions

-   **GET** `/team/{teamId}/completed`
-   Lists all completed sessions
-   Includes full results and performance data
-   Sorted by completion date

#### Date Range Sessions

-   **GET** `/team/{teamId}/date-range`
-   Lists sessions within specified dates
-   Requires startDate and endDate parameters
-   Useful for calendar views

### Individual Session Management

These endpoints handle operations on specific sessions.

#### Get Session

-   **GET** `/{id}`
-   Returns detailed session information
-   Includes template and team data

#### Update Session

-   **PUT** `/{id}`
-   Modifies session details
-   Cannot update completed sessions

#### Delete Session

-   **DELETE** `/{id}`
-   Removes a session permanently
-   Only for NOT_STARTED sessions

### Session Status Management

Endpoints for controlling session workflow.

#### Start Session

-   **PATCH** `/{id}/start`
-   Changes status to IN_PROGRESS
-   Only for NOT_STARTED sessions

#### Complete Session

-   **PATCH** `/{id}/complete`
-   Marks session as COMPLETED
-   Only for IN_PROGRESS sessions

#### Cancel Session

-   **PATCH** `/{id}/cancel`
-   Marks session as CANCELLED
-   Not allowed for COMPLETED sessions

### Session Data Management

Endpoints for handling session data and results.

#### Get Template

-   **GET** `/{id}/template`
-   Returns the session's template
-   Includes phase structure

#### Get Results

-   **GET** `/{id}/results`
-   Returns session measurements
-   Includes all player data

#### Update Results

-   **PUT** `/{id}/results`
-   Records or updates measurements
-   Supports bulk updates

#### Get Phases with Players

-   **GET** `/{id}/phases-with-players`
-   Returns detailed phase information
-   Includes player data and results
-   Creates empty placeholders for missing data

## Response Objects

### ClubSession

Main session object containing:

-   Basic session details (id, title, dates)
-   Team and template references
-   Status information
-   Location and notes
-   Phase results structure

### SessionPhase

Represents a training phase:

-   Phase identification
-   Name and target
-   List of techniques
-   Measurement fields
-   Player results

### PlayerResult

Individual player measurements:

-   Player identification
-   Performance values
-   Timestamps
-   Notes

## Status Codes

-   200: Successful operation
-   201: Resource created
-   400: Invalid request
-   404: Resource not found
-   500: Server error

## Authentication

All endpoints require JWT authentication and appropriate role permissions.
