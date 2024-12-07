package com.vision.shoppingmall.category.model.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryUpdateRequest {

    @NotBlank(message = "카테고리 이름은 비어있을 수 없습니다.")
    private String categoryName;
}
