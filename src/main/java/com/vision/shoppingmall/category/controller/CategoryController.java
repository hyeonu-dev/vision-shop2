package com.vision.shoppingmall.category.controller;


import com.vision.shoppingmall.category.model.entity.Category;
import com.vision.shoppingmall.category.model.request.CategoryResponse;
import com.vision.shoppingmall.category.model.request.CategoryUpdateRequest;
import com.vision.shoppingmall.category.model.request.CreateCategoryRequest;
import com.vision.shoppingmall.category.model.response.CategoryListResponse;
import com.vision.shoppingmall.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("")
    public String getCatecoryList(Model model, @RequestParam(value = "page", defaultValue = "0") int page) {

        Page<CategoryListResponse> categories = categoryService.getCategories(page);

        model.addAttribute("categories", categories);

        return "category/list.html";
    }

    @GetMapping("/new-category")
    public String newCategory(Model model) {
        model.addAttribute("modalTitle", "카테고리 등록하기");
        return "category/category-form.html";
    }

    @PostMapping("/new-category")
    public String createCategory(
            @ModelAttribute @Valid CreateCategoryRequest request,
            BindingResult result
            ) {
        if(result.hasErrors())
            throw new IllegalArgumentException(
                    result.getAllErrors().getFirst().getDefaultMessage()
            );


        //2. 카테고리 생성 실패 시에 오류 반환
        categoryService.create(request);
        return "redirect:/categories";
    }

    @GetMapping("/update-category/{id}")
    public String updateCategoryForm(Model model, @PathVariable Long id) {

        CategoryResponse category = categoryService.findCategory(id);

        model.addAttribute("category", category);
        model.addAttribute("modalTitle", "카테고리 수정하기");

        return "category/category-form.html";
    }

    @PostMapping("/update-category/{id}")
    public String updateCategory(@PathVariable Long id, @ModelAttribute @Valid CategoryUpdateRequest request, BindingResult result) {

        if(result.hasErrors())
            throw new IllegalArgumentException(
                    result.getAllErrors().getFirst().getDefaultMessage()
            );

        //카테고리 수정 성공시 목록으로 리다이렉트
        categoryService.update(id, request);

        return "redirect:/categories";
    }

}
