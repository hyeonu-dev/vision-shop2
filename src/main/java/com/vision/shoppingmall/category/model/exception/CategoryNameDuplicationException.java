package com.vision.shoppingmall.category.model.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class CategoryNameDuplicationException extends RuntimeException {
    public CategoryNameDuplicationException() {
        super("카테고리 이름이 중복되었습니다.");
    }
}
