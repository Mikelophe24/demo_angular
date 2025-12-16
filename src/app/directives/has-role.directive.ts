import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { EcommerceStore } from '../ecommerce';
import { UserRole } from '../models/user';

/**
 * Directive để ẩn/hiện elements dựa trên role của user
 * 
 * Cách sử dụng:
 * <div *hasRole="'admin'">Chỉ admin mới thấy</div>
 * <div *hasRole="['admin', 'customer']">Admin và Customer đều thấy</div>
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private store = inject(EcommerceStore);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  
  private allowedRoles: UserRole[] = [];

  @Input() set hasRole(roles: UserRole | UserRole[]) {
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    // Theo dõi thay đổi user để cập nhật view
    effect(() => {
      const user = this.store.user();
      this.updateView();
    });
  }

  private updateView() {
    const user = this.store.user();
    
    // Clear view trước
    this.viewContainer.clear();
    
    // Kiểm tra user có role phù hợp không
    if (user && this.allowedRoles.includes(user.role)) {
      // Hiển thị element
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
