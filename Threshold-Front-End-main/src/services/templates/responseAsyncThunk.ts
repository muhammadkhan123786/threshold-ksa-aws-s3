import { inRange } from 'lodash';
import { AsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';

enum LoadingState {
    Idle = 'idle',
    Pending = 'pending',
}

enum HttpStatusCode {
    OK = 200,
    MultipleChoices = 300,
}

interface State {
    loading: LoadingState;
    currentRequestId?: string;
    entities?: Record<string, unknown>;
    isSuccess?: boolean;
    status?: number;
    error?: string | Record<string, unknown>;
}

interface ActionPayload {
    data?: Record<string, unknown>;
    status?: number;
    message?: string | { errors: Record<string, unknown> };
}

const response = (Request: AsyncThunk<any, any, any>) => {
    return (builder: ActionReducerMapBuilder<any>) => {
        builder
            .addCase(
                Request.pending,
                (
                    state: State,
                    action: PayloadAction<any, string, { requestId: string }, never>,
                ) => {
                    if (state.loading === LoadingState.Idle) {
                        state.loading = LoadingState.Pending;
                        state.currentRequestId = action.meta.requestId;
                    }
                },
            )
            .addCase(
                Request.fulfilled,
                (
                    state: State,
                    action: PayloadAction<ActionPayload, string, { requestId: string }, never>,
                ) => {
                    const { status = HttpStatusCode.OK, data } = action.payload ?? {};
                    if (
                        state.loading === LoadingState.Pending &&
                        state.currentRequestId === action.meta.requestId
                    ) {
                        state.loading = LoadingState.Idle;
                        state.entities = data ?? {};
                        state.isSuccess = inRange(
                            status,
                            HttpStatusCode.OK,
                            HttpStatusCode.MultipleChoices,
                        );
                        state.status = status;
                        state.error = undefined;
                        state.currentRequestId = undefined;
                    }
                },
            )
            .addCase(
                Request.rejected,
                (state: State, action: PayloadAction<any, string, { requestId: string }, any>) => {
                    const { statusCode, payload } = action.payload ?? {};

                    if (
                        state.loading === LoadingState.Pending &&
                        state.currentRequestId === action.meta.requestId
                    ) {
                        state.loading = LoadingState.Idle;
                        state.error = payload;
                        state.entities = undefined;
                        state.isSuccess = inRange(
                            statusCode,
                            HttpStatusCode.OK,
                            HttpStatusCode.MultipleChoices,
                        );
                        state.status = statusCode;
                        state.currentRequestId = undefined;
                    }
                },
            );
    };
};

export default response;
