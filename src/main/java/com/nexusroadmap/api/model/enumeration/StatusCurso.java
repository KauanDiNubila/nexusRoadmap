package com.nexusroadmap.api.model.enumeration;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum StatusCurso {

    @JsonProperty("not_started") NOT_STARTED,
    @JsonProperty("in_progress") IN_PROGRESS,
    @JsonProperty("completed") COMPLETED
}
